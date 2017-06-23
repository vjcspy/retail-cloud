import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class PosConfigActions {
  
  /**
   ** @REDUCER:
   *
   * Lưu các object config như tax, customer, product từ server
   *-----------------------------------------------------------------
   ** @EFFECTS:
   *
   *
   */
  static ACTION_INIT_POS_SETTINGS = 'ACTION_INIT_POS_SETTINGS';
  
  constructor(private store$: Store<any>) { }
  
  /**
   ** @ACTION:
   *
   * Sau khi pull xong setting từ server
   */
  initPosSetting(setting: Object = {}, dispatch: boolean = true): Action | void {
    const action = {type: PosConfigActions.ACTION_INIT_POS_SETTINGS, payload: setting};
    
    return dispatch === true ? this.store$.dispatch(action) : action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save order count information
   * Update to entities state
   *-----------------------------------------------------------------
   ** @EFFECTS:
   *
   *
   */
  static ACTION_RETRIEVE_ORDER_COUNT = 'ACTION_RETRIEVE_ORDER_COUNT';
  
  retrieveOrderCount(orderCount, dispatch: boolean = true): Action | void {
    const action = {type: PosConfigActions.ACTION_RETRIEVE_ORDER_COUNT, payload: {orderCount}};
    
    return dispatch === true ? this.store$.dispatch(action) : action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save current receipt
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_SAVE_RECEIPT_SETTING = 'ACTION_SAVE_RECEIPT_SETTING';
  
  saveReceiptSetting(receipt, dispatch: boolean = true): Action {
    const action = {type: PosConfigActions.ACTION_SAVE_RECEIPT_SETTING, payload: {receipt}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
