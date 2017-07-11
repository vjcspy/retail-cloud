import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {SHIFT_POPUP} from "./shift.state";

@Injectable()
export class ShiftActions {
  constructor(private store$: Store<any>) { }
  
  static ACTION_CHANGE_STATE_POPUP = 'ACTION_CHANGE_STATE_POPUP';
  
  changeStatePopup(popupOpening: SHIFT_POPUP, dispatch: boolean = true): Action {
    const action = {type: ShiftActions.ACTION_CHANGE_STATE_POPUP, payload: {popupOpening}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_CLEAR_SHIFT_STATE = 'ACTION_CLEAR_SHIFT_STATE';
  
  clearShiftState(dispatch: boolean = true): Action {
    const action = {type: ShiftActions.ACTION_CLEAR_SHIFT_STATE, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
