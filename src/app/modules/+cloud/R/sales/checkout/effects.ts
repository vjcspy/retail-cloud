import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {CheckoutActions} from "./actions";
import {CheckoutService} from "./service";
import {Observable} from "rxjs/Observable";
import {Action} from "@ngrx/store";
import {NotifyManager} from "../../../../../services/notify-manager";
import {RouterActions} from "../../../../../R/router/router.actions";

@Injectable()
export class CheckoutEffects {
  
  constructor(protected actions$: Actions,
              protected checkoutService: CheckoutService,
              protected checkoutActions: CheckoutActions,
              protected routerActions: RouterActions,
              protected notify: NotifyManager) { }
  
  @Effect() calculateTotal = this.actions$
                                 .ofType(CheckoutActions.ACTION_CALCULATE_TOTALS)
                                 .debounceTime(1000)
                                 .switchMap((z: any) => {
                                   const action: Action = z;
                                   return Observable.fromPromise(this.checkoutService.calculateToltal(action.payload['plan'], action.payload['product_id']))
                                                    .map((totals) => {
                                                      return this.checkoutActions.calculateTotalSuccess(totals, false);
                                                    })
                                                    .catch((e) => {
                                                      const reason = e && e['reason'] ? e['reason'] : e['error'];
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
                                                  setTimeout(() => {
                                                    this.routerActions.go('cloud/default/account/license/checkout', {planId});
                                                  });
      
                                                  return this.checkoutActions.submitPlanSuccess(planId, false);
                                                })
                                                .catch((e) => {
                                                  const reason = e && e['reason'] ? e['reason'] : e['error'];
                                                  this.notify.error(reason);
                                                  return Observable.of(this.checkoutActions.calculateTotalFail(reason, e, false));
                                                });
                             });
  
  @Effect() initCheckoutPayment = this.actions$
                                      .ofType(CheckoutActions.ACTION_INIT_CHECKOUT_PAYMENT)
                                      .switchMap((z: any) => {
                                        const action: Action = z;
                                        return Observable.fromPromise(this.checkoutService.getCheckoutData(action.payload))
                                                         .map((data) => this.checkoutActions.initedCheckoutPayment(data['payments'], data['totals'], false))
                                                         .catch((e) => {
                                                           const reason = e && e['reason'] ? e['reason'] : e['error'];
                                                           this.notify.error(reason);
                                                           return Observable.of(this.checkoutActions.calculateTotalFail(reason, e, false));
                                                         });
                                      });
}
