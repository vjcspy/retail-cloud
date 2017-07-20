import {ActionReducer} from "@ngrx/store";
import {CheckoutPopupActions} from "./popup.actions";
import {checkoutPopupStateFactory, CheckoutPopupStateRecord} from "./popup.state";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";

export const checkoutPopupReducer: ActionReducer<CheckoutPopupStateRecord> = (state = checkoutPopupStateFactory(), action) => {
  switch (action.type) {
    case CheckoutPopupActions.ACTION_CHECKOUT_OPEN_POPUP:
      return state.set('popupOpening', action.payload['popupOpening']);
    
    case PosQuoteActions.ACTION_RESOLVE_QUOTE:
      return state.set('popupOpening', null);
    
    default:
      return state;
  }
};
