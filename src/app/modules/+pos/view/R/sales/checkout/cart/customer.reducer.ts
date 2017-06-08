import {Action, ActionReducer} from "@ngrx/store";
import {cartCustomerStateFactory, CartCustomerStateRecord} from "./customer.state";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {CartCustomerActions} from "./customer.actions";

export const cartCustomerReducer: ActionReducer<CartCustomerStateRecord> = (state: CartCustomerStateRecord = cartCustomerStateFactory(), action: Action) => {
  switch (action.type) {
    case CartCustomerActions.ACTION_SEARCH_CART_CUSTOMER:
      return state.set('cartCustomerSearchString', action.payload['cartCustomerSearchString']);
    
    case CartCustomerActions.ACTION_RESOLVE_CART_CUSTOMERS:
      return state.set('cartCustomers', action.payload['cartCustomers']);
    
    case CartCustomerActions.ACTION_UPDATE_ACTION_CART_STATE:
      return state.set(action.payload['key'], action.payload['state']);
    
    case PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE:
      return state.set('inSearchCustomers', false);
    
    default:
      return state;
  }
};
