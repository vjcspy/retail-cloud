import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class PosSyncActions {
  constructor(private store$: Store<any>) { }
  
  /**
   ** @REDUCER:
   *
   * Close discount popup
   * Change state to know is syncing
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Prepare order to sync
   */
  static ACTION_START_SYNC_CURRENT_ORDER = 'ACTION_START_SYNC_CURRENT_ORDER';
  
  syncCurrentOrder(dispatch: boolean = true): Action {
    const action = {type: PosSyncActions.ACTION_START_SYNC_CURRENT_ORDER, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save order prepared to sync
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Sync order
   */
  static ACTION_PREPARE_ORDER_SYNC = 'ACTION_PREPARE_ORDER_SYNC';
  
  saveOrderPreparedAndSync(order, dispatch: boolean = true): Action {
    const action = {type: PosSyncActions.ACTION_PREPARE_ORDER_SYNC, payload: {order}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Calculate and save totals
   * Change state syncing to false
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Remove all data event paymentInUsed in step checkou
   */
  static ACTION_SYNC_ORDER_SUCCESS = 'ACTION_SYNC_ORDER_SUCCESS';
  
  syncOrderSuccess(quote, dispatch: boolean = true): Action {
    const action = {type: PosSyncActions.ACTION_SYNC_ORDER_SUCCESS, payload: {quote}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Change state syncing to false
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_SYNC_ORDER_ERROR = 'ACTION_SYNC_ORDER_ERROR';
  
  syncOrderError(e, dispatch: boolean = true): Action {
    const action = {type: PosSyncActions.ACTION_SYNC_ORDER_ERROR, payload: {e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   *
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Interval sync order offline
   */
  static ACTION_AUTOMATIC_SYNC_OFFLINE_ORDER = 'ACTION_AUTOMATIC_SYNC_OFFLINE_ORDER';
  
  autoSyncOfflineOrder() {
    this.store$.dispatch({type: PosSyncActions.ACTION_AUTOMATIC_SYNC_OFFLINE_ORDER});
  }
  
  /**
   ** @REDUCER:
   *
   *
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_SYNCED_OFFLINE_ORDER = 'ACTION_SYNCED_OFFLINE_ORDER';
  
  syncedOfflineOrder(data, dispatch: boolean = true) {
    const action = {type: PosSyncActions.ACTION_SYNCED_OFFLINE_ORDER, payload: data};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
