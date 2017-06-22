import {ActionReducer} from "@ngrx/store";
import {OrderDetailRecord} from "./detail.state";
import {ListActions} from "../list/list.actions";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";

export const orderDetailReducer: ActionReducer<OrderDetailRecord> = (state, action) => {
  switch (action.type) {
    
    case ListActions.ACTION_SELECT_ORDER_DETAIL:
      return state.update('detail', (detail) => {
        return detail.set('order', action.payload['order']);
      });
    
    case PosQuoteActions.ACTION_REORDER:
      return state.update('detail', (detail) => {
        return detail.set('isResolvingReorder', true);
      });
    case PosQuoteActions.ACTION_RESOLVE_QUOTE:
      return state.update('detail', (detail) => {
        return detail.set('isResolvingReorder', false);
      });
    default:
      return state;
  }
};
