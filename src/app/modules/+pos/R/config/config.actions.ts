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
  
  /**
   ** @REDUCER:
   *
   * Save order count information
   *-----------------------------------------------------------------
   ** @EFFECTS:
   *
   *
   */
  static ACTION_RETRIEVE_ORDER_COUNT = 'ACTION_RETRIEVE_ORDER_COUNT';
  
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
   ** @ACTION:
   *
   * After pull order count entities
   */
  retrieveOrderCount(orderCount, dispatch: boolean = true): Action | void {
    const action = {type: PosConfigActions.ACTION_RETRIEVE_ORDER_COUNT, payload: {orderCount}};
    
    return dispatch === true ? this.store$.dispatch(action) : action;
  }
}
