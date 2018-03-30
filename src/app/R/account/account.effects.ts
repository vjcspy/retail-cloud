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
import {NotifyManager} from "../../services/notify-manager";
import {TrackingService} from "../../services/tracking/tracking-service";

@Injectable()
export class AccountEffects {

  constructor(protected store$: Store<any>,
              protected actions$: Actions,
              protected authService: AuthenticateService,
              protected notify: NotifyManager,
              protected accountActions: AccountActions,
              protected accountService: AccountService,
              protected appStorage: AppStorage,
              protected rootActions: RootActions,
              protected trackingService: TrackingService,
              protected routerActions: RouterActions) {
  }

  @Effect() login  = this.actions$
                         .ofType(AccountActions.ACTION_LOGIN)
                         .withLatestFrom(this.store$.select('account'))
                         .switchMap((z) => {
                           return Observable.fromPromise(this.authService.signIn(z[0].payload['user']))
                                            .map(() => {
                                              const user = Meteor.user();
                                              this.accountService.saveUserToStorage(user);
                                              this.trackingService.loginTracking();
                                              const redirect = (z[1] as AccountState).redirect;
                                              if (_.isString(redirect)) {
                                                if (redirect.indexOf("http") > -1) {
                                                  window.location.replace(redirect);
                                                } else {
                                                  this.routerActions.go(redirect);
                                                }
                                              }
                                              return this.accountActions.loginSuccess(user, false);
                                            })
                                            .catch((e) => Observable.of(this.accountActions.loginFailed(false)));
                         });
  @Effect() logout = this.actions$.ofType(AccountActions.ACTION_LOGOUT)
                         .switchMap(() => {
                           return Observable.fromPromise(this.authService.signOut())
                                            .map(() => {
                                              this.appStorage.localClear();
                                              mixpanel.reset();
                                              setTimeout(() => {
                                                location.reload(true);
                                              }, 200);
                                              return this.accountActions.goLoginPage(false, false);
                                            })
                                            .catch((e) => Observable.of(this.accountActions.logoutFailed(false)));
                         });

  @Effect() loginSuccess = this.actions$
                               .ofType(AccountActions.ACTION_LOGIN_SUCCESS)
                               .switchMap((z: any) => {
                                 return Observable.fromPromise(this.accountService.saveVersionToCookie())
                                                  .map(() => {
                                                    window.location.reload(true);

                                                    return this.rootActions.nothing("");
                                                  });
                               });

  @Effect() goLoginPage = this.actions$.ofType(AccountActions.ACTION_GO_LOGIN_PAGE)
                              .map(() => {
                                this.routerActions.go('/account/login');

                                return this.rootActions.nothing("Go login page", false);
                              });

}
