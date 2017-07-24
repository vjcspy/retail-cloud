import {ActionReducer} from "@ngrx/store";
import {CheckoutPopupActions} from "./popup.actions";
import {checkoutPopupStateFactory, CheckoutPopupStateRecord} from "./popup.state";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import * as _ from 'lodash';

export const checkoutPopupReducer: ActionReducer<CheckoutPopupStateRecord> = (state = checkoutPopupStateFactory(), action) => {
  switch (action.type) {
    case CheckoutPopupActions.ACTION_CHECKOUT_OPEN_POPUP:
      state = state.set('popupOpening', action.payload['popupOpening']);
      if (_.isObject(action.payload['data'])) {
        _.forEach(action.payload['data'], (v, k) => {
          if (k === 'customerPopup') {
            state = openCustomerBillingAddress(state, v);
          }
          state = state.set(k, v);
        });
      }
      return state;
    
    case PosQuoteActions.ACTION_RESOLVE_QUOTE:
      return state.set('popupOpening', null);
    
    default:
      return state;
  }
};

function openCustomerBillingAddress(state: CheckoutPopupStateRecord, data): CheckoutPopupStateRecord {
  return state.set('customerPopup', Object.assign({}, {...data}));
}
