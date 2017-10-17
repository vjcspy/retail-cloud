import {ActionReducer} from "@ngrx/store";
import {pricingStateFactory, PricingStateRecord} from "./state";
import {PricingActions} from "./actions";

export const pricingReducer: ActionReducer<PricingStateRecord> = (state = pricingStateFactory(), action) => {
  switch (action.type) {
    case PricingActions.ACTION_SAVE_PRICE:
      return state.set('processing', true);
    
    default:
      return state;
  }
};
