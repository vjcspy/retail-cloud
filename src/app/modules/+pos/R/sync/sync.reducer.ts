import {Action, ActionReducer} from "@ngrx/store";
import {posOrderSyncFactory, posSyncStateFactory, PosSyncStateRecord} from "./sync.state";
import {PosSyncActions} from "./sync.actions";

export const posSyncReducer: ActionReducer<PosSyncStateRecord> = (state: PosSyncStateRecord = posSyncStateFactory(), action: Action) => {
  switch (action.type) {
    case PosSyncActions.ACTION_START_SYNC_CURRENT_ORDER:
      return state.set('isSyncing', true);
    
    case PosSyncActions.ACTION_PREPARE_ORDER_SYNC:
      return state.set('order', posOrderSyncFactory(action.payload['order']));
    
    case PosSyncActions.ACTION_SYNC_ORDER_SUCCESS:
    case PosSyncActions.ACTION_SYNC_ORDER_ERROR:
      return state.set('isSyncing', false);
    
    default:
      return state;
  }
};

