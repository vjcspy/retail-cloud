import {ActionReducer} from "@ngrx/store";
import {CheckoutPopupActions} from "./popup.actions";
import {checkoutPopupStateFactory, CheckoutPopupStateRecord} from "./popup.state";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import * as _ from 'lodash';
import {EntityCustomerActions} from "../../../../../R/entities/entity/customer.actions";

export const checkoutPopupReducer: ActionReducer<CheckoutPopupStateRecord> = (state = checkoutPopupStateFactory(), action) => {
  switch (action.type) {
    case CheckoutPopupActions.ACTION_CHECKOUT_OPEN_POPUP:
      if (!action.payload['popupOpening']) {
        return checkoutPopupStateFactory();
      } else {
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
      }
    
    case PosQuoteActions.ACTION_RESOLVE_QUOTE:
      return checkoutPopupStateFactory();
    
    case CheckoutPopupActions.ACTION_ADD_EDIT_CUSTOMER_ADDRESS:
      return state.setIn(['customerPopup', 'editAddress'], Object.assign({}, {...action.payload['editAddress']}))
                  .setIn(['customerPopup', 'addressState'], 'edit');
    
    case EntityCustomerActions.ACTION_SAVE_CUSTOMER_ADDRESS:
      return state.setIn(['customerPopup', 'isSaving'], true);
    
    case EntityCustomerActions.ACTION_SAVE_CUSTOMER_ADDRESS_FAILED:
    case EntityCustomerActions.ACTION_SAVE_CUSTOMER_ADDRESS_SUCCESSFULLY:
      return state.setIn(['customerPopup', 'isSaving'], false);
    
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
