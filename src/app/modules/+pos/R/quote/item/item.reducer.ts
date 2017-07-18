import {ActionReducer} from "@ngrx/store";
import {PosQuoteStateRecord} from "../quote.state";
import {QuoteItemActions} from "./item.actions";
import * as _ from 'lodash';
import {PosQuoteActions} from "../quote.actions";

export const quoteItemReducer: ActionReducer<PosQuoteStateRecord> = (state, action) => {
  switch (action.type) {
    
    case QuoteItemActions.ACTION_REMOVE_ITEM_BUY_REQUEST:
      return state.update('items', (items) => items.filterNot((itemBuyRequest) => {
        return _.isEqual(itemBuyRequest, action.payload['buyRequest']);
      }));
    
    case PosQuoteActions.ACTION_QUOTE_ADD_ITEM_ERROR:
      return state.update('items', (items) => items.filterNot((item) => {
        return _.isEqual(item, action.payload['item']);
      }));
    
    default:
      return state;
  }
};
