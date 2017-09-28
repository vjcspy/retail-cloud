import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {AccountActions} from "./account.actions";
import {Observable} from "rxjs";
import {AccountService} from "./account.service";
import {RootActions} from "../root.actions";
import {AccountState} from "./account.state";
import * as _ from 'lodash';
import {RouterActions} from "../router/router.actions";

@Injectable()
export class AccountEffects {
  
  constructor(protected store$: Store<any>,
              protected actions$: Actions,
              protected accountActions: AccountActions,
              protected accountService: AccountService,
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
  
  @Effect() loginSuccess = this.actions$
                               .ofType(
                                 AccountActions.ACTION_LOGIN_SUCCESS,
                                 AccountActions.ACTiON_USER_REGISTER_SUCCESS,
                               )
                               .withLatestFrom(this.store$.select('account'))
                               .map((z: any) => {
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
                                })
}
