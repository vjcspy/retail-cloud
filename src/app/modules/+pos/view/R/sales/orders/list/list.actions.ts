import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ListActions {
  constructor(private store$: Store<any>) { }
  
  /**
   ** @REDUCER:
   *
   * Save order filtered and grouped
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_RESOLVED_ORDERS = 'ACTION_RESOLVED_ORDERS';
  
  reslvedOrders(ordersGroped, dispatch: boolean = true): Action {
    const action = {type: ListActions.ACTION_RESOLVED_ORDERS, payload: {ordersGroped}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Update search data
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Resolve orders
   */
  static ACTION_CHANGE_SEARCH_DATA = 'ACTION_CHANGE_SEARCH_DATA';
  
  changeSearchData(searchData, dispatch: boolean = true): Action {
    const action = {type: ListActions.ACTION_CHANGE_SEARCH_DATA, payload: {searchData}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Change state
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_SEARCH_ONLINE_FAILED = 'ACTION_SEARCH_ONLINE_FAILED';
  
  searchOnlineFailed(e, dispatch: boolean = true): Action {
    const action = {type: ListActions.ACTION_SEARCH_ONLINE_FAILED, payload: {e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save order detail
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_SELECT_ORDER_DETAIL = 'ACTION_SELECT_ORDER_DETAIL';
  
  selectOrderDetail(order, dispatch: boolean = true): Action {
    const action = {type: ListActions.ACTION_SELECT_ORDER_DETAIL, payload: {order}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_NEED_PULL_MORE_ORDER = 'ACTION_NEED_PULL_MORE_ORDER';
  
  needPullMoreOrder(dispatch: boolean = true): Action {
    const action = {type: ListActions.ACTION_NEED_PULL_MORE_ORDER, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
