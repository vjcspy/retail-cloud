import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PricingActions} from "./actions";
import {PricingService} from "./service";
import {Observable} from "rxjs/Observable";
import {RouterActions} from "../../../../R/router/router.actions";
import {NotifyManager} from "../../../../services/notify-manager";

@Injectable()
export class PricingEffects {
  
  constructor(protected store$: Store<any>,
              protected actions$: Actions,
              protected pricingActions: PricingActions,
              protected routerActions: RouterActions,
              protected notify: NotifyManager,
              protected pricingService: PricingService) { }
  
  @Effect() savePricing = this.actions$
                              .ofType(
                                PricingActions.ACTION_SAVE_PRICE
                              )
                              .switchMap((z: any) => {
                                const action: Action = z;
                                return Observable.fromPromise(this.pricingService.savePricing(action.payload['pricing']))
                                                 .map(() => {
                                                   setTimeout(() => {
                                                     this.routerActions.go('cloud/default/pricing/list');
                                                   });
                                                   this.notify.success('save_pricing_successfully');
                                                   return this.pricingActions.savePricingSuccess(null, false);
                                                 })
                                                 .catch((e) => {
                                                   const reason = e && e['reason'] ? e['reason'] : '';
                                                   this.notify.error(reason);
                                                   return Observable.of(this.pricingActions.savePricingFail(reason, false));
                                                 });
                              });
}
