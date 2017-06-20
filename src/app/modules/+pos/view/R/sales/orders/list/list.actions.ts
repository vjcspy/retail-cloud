import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ListActions {
  constructor(private store$: Store<any>) { }
  
  /**
   ** @REDUCER:
   *
   * change state
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_CHANGE_STATE_SEARCH_ONLINE = 'CHANGE_STATE_SEARCH_ONLINE';
  
  changeStateSearchOnline(isSearchOnline, dispatch: boolean = true): Action {
    const action = {type: ListActions.ACTION_CHANGE_STATE_SEARCH_ONLINE, payload: {isSearchOnline}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
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
}
