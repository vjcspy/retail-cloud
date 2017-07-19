import {ActionReducer} from "@ngrx/store";
import {PosQuoteStateRecord} from "../quote.state";

export const quoteRefundReducer: ActionReducer<PosQuoteStateRecord> = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
