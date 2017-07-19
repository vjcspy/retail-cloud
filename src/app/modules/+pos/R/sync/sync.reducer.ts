import {Action, ActionReducer} from "@ngrx/store";
import {posOrderSyncFactory, posSyncStateFactory, PosSyncStateRecord} from "./sync.state";
import {PosSyncActions} from "./sync.actions";
import {QuoteRefundActions} from "../quote/refund/refund.actions";

export const posSyncReducer: ActionReducer<PosSyncStateRecord> = (state: PosSyncStateRecord = posSyncStateFactory(), action: Action) => {
  switch (action.type) {
    case QuoteRefundActions.ACTION_LOAD_CREDITMEMO:
    case PosSyncActions.ACTION_START_SYNC_CURRENT_ORDER:
      return state.set('isSyncing', true);
    
    case PosSyncActions.ACTION_PREPARE_ORDER_SYNC:
      return state.set('order', posOrderSyncFactory(action.payload['order']))
                  .set('isSyncing', true);
    
    case QuoteRefundActions.ACTION_LOAD_CREDITMEMO_SUCCESS:
    case QuoteRefundActions.ACTION_LOAD_CREDITMEMO_FAILED:
    case QuoteRefundActions.ACTION_SAVE_CREDITMEMO_SUCCESS:
    case PosSyncActions.ACTION_SYNC_ORDER_SUCCESS:
    case PosSyncActions.ACTION_SYNC_ORDER_ERROR:
      return state.set('isSyncing', false);
    
    default:
      return state;
  }
};

