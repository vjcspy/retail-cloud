import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {AccountActions} from "./account.actions";
import {Observable} from "rxjs";
import {AuthenticateService} from "../../services/authenticate";
import {AccountService} from "./account.service";

@Injectable()
export class AccountEffects {
  
  constructor(protected store$: Store<any>,
              protected actions$: Actions,
              protected authService: AuthenticateService,
              protected accountActions: AccountActions,
              protected accountService: AccountService) { }
  
  @Effect() loggin = this.actions$
                         .ofType(AccountActions.ACTION_LOGIN)
                         .withLatestFrom(this.store$.select('account'))
                         .switchMap((z) => {
                           return Observable.fromPromise(this.authService.signIn(z[0].payload['user']))
                                            .map(() => {
                                              const user = Meteor.user();
                                              this.accountService.saveUserToStorage(user);
      
                                              return this.accountActions.loginSuccess(user, false);
                                            })
                                            .catch((e) => Observable.of(this.accountActions.loginFailed(false)))
                         });
}
