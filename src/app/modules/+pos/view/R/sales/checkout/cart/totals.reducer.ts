import {Action, ActionReducer} from "@ngrx/store";
import {cartTotalsStateFactory, CartTotalsStateRecord} from "./totals.state";
import {CartTotalsActions} from "./totals.actions";
import {PosSyncActions} from "../../../../../R/sync/sync.actions";

export const cartTotalsReducer: ActionReducer<CartTotalsStateRecord> = (state = cartTotalsStateFactory(), action: Action) => {
  switch (action.type) {
    case CartTotalsActions.ACTION_CHANGE_DISCOUNT_POPUP_STATE:
      return state.set('isOpeningPopupDiscount', action.payload['isOpeningPopupDiscount']);
    
    case CartTotalsActions.ACTION_CHANGE_DISCOUNT_TYPE:
      return state.set('isDiscountWholeOrderValue', action.payload['isDiscountWholeOrderValue']);
    
    case PosSyncActions.ACTION_START_SYNC_CURRENT_ORDER:
      return state.set('isOpeningPopupDiscount', false);
    
    case CartTotalsActions.ACTION_TOGGLE_BLOCK_TOTAL_STATE:
      return state.set('isOpenTotalBlock', !state.isOpenTotalBlock);
    
    default:
      return state;
  }
};
