import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {ShopManageActions} from "./actions";
import {Observable} from "rxjs/Observable";
import {ShopManageService} from "./service";
import {NotifyManager} from "../../../../services/notify-manager";

@Injectable()
export class ShopManageEffects {
  
  constructor(protected store$: Store<any>,
              protected actions$: Actions,
              protected shopManageService: ShopManageService,
              protected shopManageActions: ShopManageActions,
              protected notify: NotifyManager) { }
  
  @Effect() saveRoles = this.actions$
                            .ofType(
                              ShopManageActions.ACTION_SAVE_ROLE
                            )
                            .switchMap((z: any) => {
                              const action = z;
                              return Observable.fromPromise(this.shopManageService.saveRole(action.payload['role']))
                                               .map(() => this.shopManageActions.saveRoleSuccess(false))
                                               .catch((e) => {
                                                 const reason = e && e['reason'] ? e['reason'] : e['error'];
                                                 this.notify.error(reason);
                                                 return Observable.of(this.shopManageActions.saveRoleFail(reason, e, false));
                                               });
                            });
}
