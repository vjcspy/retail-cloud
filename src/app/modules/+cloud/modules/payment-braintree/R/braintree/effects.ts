import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {BraintreeActions} from "./actions";
import {Observable} from "rxjs/Observable";
import {Action, Store} from "@ngrx/store";
import {BraintreeService} from "./service";
import {SalesState} from "../../../../R/sales/state";
import {CheckoutActions} from "../../../../R/sales/checkout/actions";

@Injectable()
export class BraintreeEffects {
  
  constructor(protected actions$: Actions,
              protected store$: Store<any>,
              protected checkoutActions: CheckoutActions,
              protected braintreeActions: BraintreeActions,
              protected braintreeService: BraintreeService) { }
  
  @Effect() createDropin = this.actions$
                               .ofType(BraintreeActions.ACTION_BRAINTREE_DROPIN_CREATE)
                               .switchMap((z: any) => {
                                 const action: Action = z;
    
                                 return Observable.fromPromise(this.braintreeService.getBraintree().initClient())
                                                  .map(() => {
                                                    return this.braintreeActions.dropinCreateSuccess(false);
                                                  });
                               });
  
  @Effect() requestPaymentMethod = this.actions$
                                       .ofType(BraintreeActions.ACTION_REQUEST_PAYMENT_METHOD)
                                       .withLatestFrom(this.store$.select('sales'))
                                       .switchMap((z: any) => {
                                         const salesState: SalesState = z[1];
                                         return Observable.fromPromise(this.braintreeService
                                                                           .getBraintree()
                                                                           .requestPaymentMethod(salesState.checkout.orderType, salesState.checkout.orderId))
                                                          .map(() => this.checkoutActions.paySuccess(false));
                                       });
}
