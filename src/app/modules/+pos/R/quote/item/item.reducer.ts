import {ActionReducer} from "@ngrx/store";
import {PosQuoteStateRecord} from "../quote.state";
import {QuoteItemActions} from "./item.actions";
import * as _ from 'lodash';

export const quoteItemReducer: ActionReducer<PosQuoteStateRecord> = (state, action) => {
  switch (action.type) {
    
    case QuoteItemActions.ACTION_REMOVE_ITEM_BUY_REQUEST:
      return state.update('items', (items) => items.filterNot((itemBuyRequest) => {
        return _.isEqual(itemBuyRequest, action.payload['buyRequest']);
      }));
    
    default:
      return state;
  }
};
