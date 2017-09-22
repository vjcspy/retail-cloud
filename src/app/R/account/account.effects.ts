import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {AccountActions} from "./account.actions";
import {Observable} from "rxjs";
import {AuthenticateService} from "../../services/authenticate";
import {AccountService} from "./account.service";
import {RootActions} from "../root.actions";
import {AccountState} from "./account.state";
import * as _ from 'lodash';
import {RouterActions} from "../router/router.actions";
import {AppStorage} from "../../services/storage";

@Injectable()
export class AccountEffects {
  
  constructor(protected store$: Store<any>,
              protected actions$: Actions,
              protected authService: AuthenticateService,
              protected accountActions: AccountActions,
              protected accountService: AccountService,
              protected appStorage: AppStorage,
              protected rootActions: RootActions,
              protected routerActions: RouterActions) { }
  
  @Effect() login = this.actions$
                        .ofType(AccountActions.ACTION_LOGIN)
                        .withLatestFrom(this.store$.select('account'))
                        .switchMap((z) => {
                          return Observable.fromPromise(this.authService.signIn(z[0].payload['user']))
                                           .map(() => {
                                             return this.accountActions.loginSuccess(false);
                                           })
                                           .catch((e) => Observable.of(this.accountActions.loginFailed(false)));
                        });
  
  @Effect() loginSuccess = this.actions$
                               .ofType(
                                 AccountActions.ACTION_LOGIN_SUCCESS,
                                 AccountActions.ACTiON_USER_REGISTER_SUCCESS,
                               )
                               .withLatestFrom(this.store$.select('account'))
                               .map((z: any) => {
                                 const user = Meteor.user();
                                 this.accountService.saveUserToStorage(user);
    
                                 const redirect = (z[1] as AccountState).redirect;
                                 if (_.isString(redirect)) {
                                   if (redirect.indexOf("http") > -1) {
                                     window.location.replace(redirect);
                                   } else {
                                     this.routerActions.go(redirect);
                                   }
                                 }
    
                                 return this.rootActions.nothing("", false);
                               });
  
  @Effect() register = this.actions$
                           .ofType(AccountActions.ACTION_USER_REGISTER)
                           .withLatestFrom(this.store$.select('account'))
                           .switchMap((z: any) => {
                             const action = z[0];
                             return Observable.fromPromise(this.authService.signUp(action['payload']['user']))
                                              .map(() => {
                                                return this.accountActions.registerSuccess(false);
                                              })
                                              .catch((e) => {
                                                console.log(e);
                                                return Observable.of(this.accountActions.registerFailed(e, false));
                                              });
                           });
  
  @Effect() logout = this.actions$.ofType(AccountActions.ACTION_LOGOUT)
                         .switchMap(() => {
                           return Observable.fromPromise(this.authService.signOut())
                                            .map(() => {
                                              this.appStorage.localClear();
                                              setTimeout(() => {
                                                location.reload(true);
                                              }, 200);
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
