import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {LicenseActions} from "./actions";
import {LicenseService} from "./service";
import {Observable} from "rxjs/Observable";
import {NotifyManager} from "../../../../services/notify-manager";
import {RouterActions} from "../../../../R/router/router.actions";

@Injectable()
export class LicenseEffects {
  
  constructor(protected store$: Store<any>,
              protected actions$: Actions,
              protected licenseService: LicenseService,
              protected notify: NotifyManager,
              protected licenseActions: LicenseActions,
              protected routerActions: RouterActions) { }
  
  @Effect() saveLicense = this.actions$
                              .ofType(
                                LicenseActions.ACTION_SAVE_LICENSE_BY_ADMIN
                              )
                              .switchMap((z: any) => {
                                const action: Action = z;
    
                                return Observable.fromPromise(this.licenseService.saveLicenseByAdmin(action.payload['license'], action.payload['licenseHasProducts'], action.payload['user']))
                                                 .map(() => {
                                                   this.notify.success("save_successfully");
      
                                                   setTimeout(() => {
                                                     this.routerActions.go('cloud/default/license/list');
                                                   });
      
                                                   return this.licenseActions.saveLicenseSuccess(false);
                                                 })
                                                 .catch((e) => {
                                                   const reason = e && e['reason'] ? e['reason'] : e['error'];
                                                   this.notify.error(reason);
      
                                                   return Observable.of(this.licenseActions.saveLicenseFail(reason, e, false));
                                                 });
                              });
}
