import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {CheckoutActions} from "./actions";
import {CheckoutService} from "./service";
import {Observable} from "rxjs/Observable";
import {Action} from "@ngrx/store";
import {NotifyManager} from "../../../../../services/notify-manager";

@Injectable()
export class CheckoutEffects {
  
  constructor(protected actions$: Actions,
              protected checkoutService: CheckoutService,
              protected checkoutActions: CheckoutActions,
              protected notify: NotifyManager) { }
  
  @Effect() calculateTotal = this.actions$
                                 .ofType(CheckoutActions.ACTION_CALCULATE_TOTALS)
                                 .switchMap((z: any) => {
                                   const action: Action = z;
                                   return Observable.fromPromise(this.checkoutService.calculateToltal(action.payload['plan'], action.payload['product_id']))
                                                    .map((total) => this.checkoutActions.calculateTotalSuccess(total, false))
                                                    .catch((e) => {
                                                      const reason = e && e['reason'] ? e['reason'] : '';
                                                      this.notify.error(reason);
                                                      return Observable.of(this.checkoutActions.calculateTotalFail(reason, e, false));
                                                    });
                                 });
  
  @Effect() submitPlan = this.actions$
                             .ofType(CheckoutActions.ACTION_SUBMIT_PLAN)
                             .switchMap((z: any) => {
                               const action: Action     = z;
                               const {plan, product_id} = action['payload'];
                               return Observable.fromPromise(this.checkoutService.submitOrder(plan, product_id))
                                                .map((planId) => {
                                                  this.notify.success("submit_plan_success");
                                                  
                                                  return this.checkoutActions.submitPlanSuccess(planId, false);
                                                })
                                                .catch((e) => {
                                                  const reason = e && e['reason'] ? e['reason'] : '';
                                                  this.notify.error(reason);
                                                  return Observable.of(this.checkoutActions.calculateTotalFail(reason, e, false));
                                                });
                             });
}
