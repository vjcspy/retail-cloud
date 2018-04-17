import { Action, ActionReducer } from "@ngrx/store";
import {PosQuoteStateRecord} from "../quote.state";
import {QuoteRefundActions} from "./refund.actions";

export const quoteRefundReducer: ActionReducer<PosQuoteStateRecord> = (state: PosQuoteStateRecord, action: Action) => {
  switch (action.type) {
    case QuoteRefundActions.ACTION_LOAD_CREDITMEMO_SUCCESS:
      if (action.payload['creditmemo']['totals']['grand_total'] !== 0) {
        return state.set('creditmemo', action.payload['creditmemo'])
          .set('info', Object.assign({}, {...state.info}, {isRefunding: true}));
      }

    case QuoteRefundActions.ACTION_SAVE_CREDITMEMO_SUCCESS:
      return state
                  .set('info', Object.assign({}, {...state.info}, {isRefunding: false}));

    case QuoteRefundActions.ACTION_LOAD_CREDITMEMO_QTY_ZERO:
      return state.set('info', Object.assign({}, {...state.info}, {isRefunding: false}));

    default:
      return state;
  }
};
