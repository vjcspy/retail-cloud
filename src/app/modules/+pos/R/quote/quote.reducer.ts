import {Action, ActionReducer} from "@ngrx/store";
import {posQuoteStateFactory, PosQuoteStateRecord} from "./quote.state";
import {PosQuoteActions} from "./quote.actions";
import * as _ from 'lodash';

export const quoteReducer: ActionReducer<PosQuoteStateRecord> = (state: PosQuoteStateRecord = posQuoteStateFactory(), action: Action) => {
  switch (action.type) {
    case PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE:
      return state.set('customer', action.payload['customer']);
    
    case PosQuoteActions.ACTION_INIT_DEFAULT_CUSTOMER_ADDRESS:
      let newState = state;
      _.forEach(action.payload, (v, k) => {
        if (!!v) {
          newState = newState.set(k, v);
        }
      });
      return newState;
    
    case PosQuoteActions.ACTION_UPDATE_QUOTE_INFO:
      return state.update('info', (info: Object) => Object.assign({}, {...info}, action.payload));
    
    default:
      return state;
  }
};
