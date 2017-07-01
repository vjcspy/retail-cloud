import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class CartActionBarActions {
  constructor(private store$: Store<any>) { }
  
  static CHANGE_STATE_NOTE_POPUP = 'CHANGE_STATE_NOTE_POPUP';
  
  changeStateNotePopup(state: boolean): void {
    this.store$.dispatch({type: CartActionBarActions.CHANGE_STATE_NOTE_POPUP, payload: {state}})
  }
  
  static ACTION_CHANGE_MODE_ACTIONS_POPUP = 'ACTION_CHANGE_MODE_ACTIONS_POPUP';
  
  changeModeActionPopup(isOpenActions, dispatch: boolean = true): Action {
    const action = {type: CartActionBarActions.ACTION_CHANGE_MODE_ACTIONS_POPUP, payload: {isOpenActions}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_CHANGE_MODE_ACTIONS_ORDER_ONHOLD_POPUP = 'ACTION_CHANGE_MODE_ACTIONS_ORDER_ONHOLD_POPUP';
  
  changeModeOrderOnholdPopup(isOpenOrderOnhold, dispatch: boolean = true): Action {
    const action = {type: CartActionBarActions.ACTION_CHANGE_MODE_ACTIONS_ORDER_ONHOLD_POPUP, payload: {isOpenOrderOnhold}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_RESOLVED_ORDER_ONHOLD = 'ACTION_RESOLVED_ORDER_ONHOLD';
  
  resolvedOrderOnhold(orderOnhold, dispatch: boolean = true): Action {
    const action = {type: CartActionBarActions.ACTION_RESOLVED_ORDER_ONHOLD, payload: {orderOnhold}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_RETRIEVE_ORDER_ONHOLD = 'ACTION_RETRIEVE_ORDER_ONHOLD';
  
  retrieveOrderOnhold(order, dispatch: boolean = true): Action {
    const action = {type: CartActionBarActions.ACTION_RETRIEVE_ORDER_ONHOLD, payload: {order}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_ORDER_ONHOLD = 'ACTION_SAVE_ORDER_ONHOLD';
  
  saveOrderOnhold(dispatch: boolean = true): Action {
    const action = {type: CartActionBarActions.ACTION_SAVE_ORDER_ONHOLD, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static SEARCH_ORDER_ONHOLD = 'SEARCH_ORDER_ONHOLD';
  
  searchOrderOnhold(orderOnholdSearchString, dispatch: boolean = true): Action {
    const action = {type: CartActionBarActions.SEARCH_ORDER_ONHOLD, payload: {orderOnholdSearchString}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
