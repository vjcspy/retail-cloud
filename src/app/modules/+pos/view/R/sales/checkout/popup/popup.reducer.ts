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
          } else {
            state = state.set(k, v);
          }
        });
      }
      return state;
    
    case PosQuoteActions.ACTION_RESOLVE_QUOTE:
      return state.set('popupOpening', null);
    
    case CheckoutPopupActions.ACTION_ADD_EDIT_CUSTOMER_ADDRESS:
      return state.setIn(['customerPopup', 'editAddress'], Object.assign({}, {...action.payload['editAddress']}))
                  .setIn(['customerPopup', 'addressState'], 'edit');
    
    default:
      return state;
  }
};

function openCustomerBillingAddress(state: CheckoutPopupStateRecord, data): CheckoutPopupStateRecord {
  _.forEach(data, (v, k) => {
    state = state.setIn(['customerPopup', k], v);
  });
  
  return state;
}
