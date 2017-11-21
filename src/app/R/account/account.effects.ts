import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {AccountActions} from "./account.actions";
import {Observable} from "rxjs";
import * as _ from 'lodash';
import {List} from "immutable";
import {AccountService} from "./account.service";
import {RootActions} from "../root.actions";
import {RouterActions} from "../router/router.actions";
import {AuthenticateService} from "../../services/authenticate";
import {AccountState} from "./account.state";


@Injectable()
export class AccountEffects {
  
  constructor(protected store$: Store<any>,
              protected actions$: Actions,
              protected accountActions: AccountActions,
              protected accountService: AccountService,
              protected authenticate: AuthenticateService,
              protected rootActions: RootActions,
              protected routerActions: RouterActions) { }
  
  @Effect() login = this.actions$
                        .ofType(AccountActions.ACTION_LOGIN)
                        .withLatestFrom(this.store$.select('account'))
                        .switchMap((z) => {
                          return this.accountService.signIn(z[0].payload['user'], z[0].payload['baseUrl'])
                                           .map((data) => {
                                             const user = data;
                                             this.accountService.saveUserToStorage(user);
                                             this.accountService.saveBaseUrlToStorage(z[0].payload['baseUrl']);
                                             this.accountService.saveLicenseToStorage();
                                             const redirect = (z[1] as AccountState).redirect;
                                             if (_.isString(redirect)) {
                                               if (redirect.indexOf("http") > -1) {
                                                 window.location.replace(redirect);
                                               } else {
                                                 this.routerActions.go(redirect);
                                               }
                                             }
                                             let accountUser = {
                                               'id': user['_id'],
                                               'username': user['username'],
                                               'emails': user['email'],
                                               'baseUrl': z[0].payload['baseUrl'],
                                               'role': user['role']
                                             }
                                             return this.accountActions.loginSuccess(accountUser, false);
                                           })
                                           .catch((e) => Observable.of(this.accountActions.loginFailed(false)));
                        });
  
  
  @Effect() logout = this.actions$.ofType(AccountActions.ACTION_LOGOUT)
                         .switchMap(() => {
                           return Observable.fromPromise(this.accountService.logout())
                                            .map(() => {
                                             this.accountService.localClear();
                                             setTimeout(()=>{
                                               location.reload(true);
                                             },200);
                                              
                                              return this.accountActions.goLoginPage(false, false);
                                            })
                                            .catch((e) => Observable.of(this.accountActions.logoutFailed(false)));
                         });
  
  @Effect() goLoginPage = this.actions$.ofType(AccountActions.ACTION_GO_LOGIN_PAGE)
                              .map(() => {
                                this.routerActions.go('/account/login');
    
                                return this.rootActions.nothing("Go login page", false);
                              });
  
}
