import {Action, ActionReducer} from "@ngrx/store";
import {SalesStateRecord} from "../state";
import {CheckoutActions} from "./actions";
import {CheckoutSateRecord} from "./state";

export const checkoutReducer: ActionReducer<SalesStateRecord> = (state: SalesStateRecord, action: Action) => {
  if (action.type === CheckoutActions.ACTION_CALCULATE_TOTALS) {
    return state.update('checkout', (checkout: CheckoutSateRecord) => checkout.set('isCalculating', true));
  }
  
  if (action.type === CheckoutActions.ACTION_CALCULATE_TOTAL_SUCCESS) {
    return state.update('checkout', (checkout: CheckoutSateRecord) => checkout.set('isCalculating', false)
                                                                              .set('totals', action.payload['totals']));
  }
  
  if (action.type === CheckoutActions.ACTION_CALCULATE_TOTAL_FAIL) {
    return state.update('checkout', (checkout: CheckoutSateRecord) => checkout.set('isCalculating', false));
  }
  
  if (action.type === CheckoutActions.ACTION_INITED_CHECKOUT_PAYMENT) {
    return state.update('checkout', (checkout: CheckoutSateRecord) => checkout.set('payments', action.payload['payments']));
  }
  
  return state;
};
