import {Action, ActionReducer} from "@ngrx/store";
import {CheckoutStep, PosStepStateRecord} from "../step.state";
import {PosStepActions} from "../step.actions";
import {OrderListAddPaymentActions} from "./add-payment.actions";
import {removeDataStep} from "../step.reducer";

export const orderListAddPaymentReducer: ActionReducer<PosStepStateRecord> = (state: PosStepStateRecord, action: Action) => {
  const type = action.type;
  
  if (type === OrderListAddPaymentActions.ACTION_NEED_ADD_PAYMENT) {
    return state.set('orderOffline', action.payload['order']);
  }
  
  if (type === PosStepActions.ACTION_UPDATE_CHECKOUT_PAYMENT_DATA) {
    if (!!state.orderOffline && state.orderOffline['order_id']) {
      return state.set('checkoutStep', CheckoutStep.TAKE_PAYMENT);
    }
  }
  
  if (type === OrderListAddPaymentActions.ACTION_ADD_PAYMENT_SUCCESS) {
    return removeDataStep(state);
  }
  
  return state;
};
