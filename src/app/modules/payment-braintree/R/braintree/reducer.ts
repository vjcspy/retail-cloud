import {ActionReducer} from "@ngrx/store";
import {BraintreeStateRecord, makeBraintreeStateFactory} from "./state";
import {BraintreeActions} from "./actions";

export const braintreeReducer: ActionReducer<BraintreeStateRecord> = (state = makeBraintreeStateFactory(), action) => {
  if (action.type === BraintreeActions.ACTION_BRAINTREE_DROPIN_CREATE) {
    state = state.set('dropinCreated', false);
  }
  
  if (action.type === BraintreeActions.ACTION_BRAINTREE_DROPIN_CREATE_SUCCESS) {
    state = state.set('dropinCreated', true);
  }
  
  return state;
};
