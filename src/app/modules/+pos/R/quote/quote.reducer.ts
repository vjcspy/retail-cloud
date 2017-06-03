import {Action, ActionReducer} from "@ngrx/store";
import {posQuoteStateFactory, PosQuoteStateRecord} from "./quote.state";
import {PosQuoteActions} from "./quote.actions";

export const quoteReducer: ActionReducer<PosQuoteStateRecord> = (state: PosQuoteStateRecord = posQuoteStateFactory(), action: Action) => {
  switch (action.type) {
    case PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE:
      return state.set('customer', action.payload['customer']);
    
    case PosQuoteActions.ACTION_UPDATE_QUOTE_INFO:
      return state.update('info', (info: Object) => Object.assign({}, {...info}, action.payload));
      
    default:
      return state;
  }
};
