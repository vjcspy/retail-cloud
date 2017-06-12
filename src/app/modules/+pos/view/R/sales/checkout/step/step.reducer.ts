import {Action, ActionReducer} from "@ngrx/store";
import {CheckoutStep, posStepStateFactory, PosStepStateRecord} from "./step.state";
import {PosStepActions} from "./step.actions";

export const posStepReducer: ActionReducer<PosStepStateRecord> = (state: PosStepStateRecord = posStepStateFactory(), action: Action) => {
  switch (action.type) {
    case PosStepActions.ACTION_BACK_CHECKOUT_PAGE:
      return state.set('checkoutStep', CheckoutStep.NONE);
    
    case PosStepActions.ACTION_GET_PAYMENT_METHOD_CAN_USE:
      return state.set('paymentMethodCanUse', action.payload['paymentMethodCanUse']);
    
    default:
      return state;
  }
};
