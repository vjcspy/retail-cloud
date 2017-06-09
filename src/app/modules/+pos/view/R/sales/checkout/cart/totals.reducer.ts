import {Action, ActionReducer} from "@ngrx/store";
import {cartTotalsStateFactory, CartTotalsStateRecord} from "./totals.state";
import {CartTotalsActions} from "./totals.actions";

export const cartTotalsReducer: ActionReducer<CartTotalsStateRecord> = (state = cartTotalsStateFactory(), action: Action) => {
  switch (action.type) {
    case CartTotalsActions.ACTION_CHANGE_DISCOUNT_POPUP_STATE:
      return state.set('isOpeningPopupDiscount', action.payload['isOpeningPopupDiscount']);
    
    case CartTotalsActions.ACTION_CHANGE_DISCOUNT_TYPE:
      return state.set('isDiscountWholeOrderValue', action.payload['isDiscountWholeOrderValue']);
    
    default:
      return state;
  }
};
