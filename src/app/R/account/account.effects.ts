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
                          return Observable.fromPromise(this.accountService.login(z[0].payload['user']))
                                           .map(() => {
                                             return this.accountActions.loginSuccess(false);
                                           })
                                           .catch((e) => Observable.of(this.accountActions.loginFailed(false)));
                        });
  
  @Effect() loginOrRegisterSuccess = this.actions$
                                         .ofType(
                                           AccountActions.ACTION_LOGIN_SUCCESS,
                                           AccountActions.ACTiON_USER_REGISTER_SUCCESS,
                                         )
                                         .withLatestFrom(this.store$.select('account'))
                                         .map((z: any) => {
                                           window.location.reload(true);
    
                                           return this.accountActions.saveAccount(this.authenticate.user, false);
                                         });
  
  @Effect() register = this.actions$
                           .ofType(AccountActions.ACTION_USER_REGISTER)
                           .withLatestFrom(this.store$.select('account'))
                           .switchMap((z: any) => {
                             const action = z[0];
                             return Observable.fromPromise(this.accountService.register(action['payload']['user']))
                                              .map(() => {
                                                return this.accountActions.registerSuccess(false);
                                              })
                                              .catch((e) => {
                                                return Observable.of(this.accountActions.registerFailed(e, false));
                                              });
                           });
  
  @Effect() logout = this.actions$.ofType(AccountActions.ACTION_LOGOUT)
                         .switchMap(() => {
                           return Observable.fromPromise(this.accountService.logout())
                                            .map(() => {
                                              this.accountService.removeStorage();
                                              location.reload(true);
                                              return this.accountActions.goLoginPage(false, false);
                                            })
                                            .catch((e) => Observable.of(this.accountActions.logoutFailed(false)));
                         });
  
  @Effect() goLoginPage = this.actions$.ofType(AccountActions.ACTION_GO_LOGIN_PAGE)
                              .map(() => {
                                this.routerActions.go('/account/login');
    
                                return this.rootActions.nothing("Go login page", false);
                              });
  
  @Effect() sendResetPassword = this.actions$
                                    .ofType(AccountActions.ACTION_USER_SEND_RESET_PASSWORD)
                                    .switchMap((z: any) => {
                                      const action: Action = z;
                                      return Observable.fromPromise(this.accountService.requestSendForgotPassword(action.payload['user']['email']))
                                                       .map(() => {
                                                         return this.accountActions.goLoginPage(false, false);
                                                       })
                                                       .catch((e) => Observable.of(this.rootActions.error("", false)));
                                    });
  
  @Effect() resetPassword = this.actions$
                                .ofType(AccountActions.ACTION_USER_RESET_PASSWORD)
                                .switchMap((z: any) => {
                                  const action: Action = z;
                                  return Observable.fromPromise(this.accountService.resetPassword(action.payload['token'], action.payload['newPassword']))
                                                   .map(() => {
                                                     return this.accountActions.goLoginPage(false, false);
                                                   })
                                                   .catch((e) => Observable.of(this.rootActions.error("", false)));
                                });
  
  @Effect() resolveUrls = this.actions$
                              .ofType(
                                AccountActions.SAVE_LICENSE_DATA
                              )
                              .withLatestFrom(this.store$.select('account'))
                              .filter((z) => {
                                const accountState: AccountState = <any>z[1];
                                return !!accountState.license && _.isArray(accountState.license['base_url']);
                              })
                              .map((z) => {
                                const accountState: AccountState = <any>z[1];
                                let listUrl                      = List.of();
                                let defaultUrl = "";
                                const urls                       = accountState.license['base_url'];
                                _.forEach(urls, (url) => {
                                  if (parseInt(url['status']) === 1) {
                                    listUrl = listUrl.push({
                                                             url: url['url'],
                                                             is_default: false,
                                                             isMage1: false
                                                           });
                                  }
                                });
                              if(listUrl.count() > 1){
                                defaultUrl = listUrl.get(0)['url'];
                              }
                                return this.accountActions.resolvedUrls(listUrl ,defaultUrl, false);
                              });
  
}
