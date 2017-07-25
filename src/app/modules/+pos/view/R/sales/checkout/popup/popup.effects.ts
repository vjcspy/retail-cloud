import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {EntityCustomerActions} from "../../../../../R/entities/entity/customer.actions";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";

@Injectable()
export class CheckoutPopupEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private quoteActions: PosQuoteActions) { }
  
  @Effect() afterSaveCustomerAddress = this.actions$
                                           .ofType(
                                             EntityCustomerActions.ACTION_SAVE_CUSTOMER_ADDRESS_SUCCESSFULLY
                                           )
                                           .map((action) => {
                                             const customer    = action.payload['customer'];
                                             const addressType = action.payload['addressType'];
    
                                             return this.quoteActions.setCustomerToQuote(customer, addressType === 'billing', addressType === 'shipping', false);
                                           });
}
