import {ActionReducer} from "@ngrx/store";
import {ConfigurationsPaymentStateRecord, configurationsStateFactory} from "./payment.state";
import {ConfigurationsPaymentActions} from "./payment.actions";

export const paymentReducer: ActionReducer<ConfigurationsPaymentStateRecord> = (state = configurationsStateFactory(), action) => {
  switch (action.type) {
    case ConfigurationsPaymentActions.ACTION_SAVE_PAYMENT:
      return state.set("isSaving", true);
    
    case ConfigurationsPaymentActions.ACTION_SAVE_PAYMENT_SUCCESS:
    case ConfigurationsPaymentActions.ACTION_SAVE_PAYMENT_FAILED:
      return state.set("isSaving", false);
    
    default:
      return state;
  }
};
