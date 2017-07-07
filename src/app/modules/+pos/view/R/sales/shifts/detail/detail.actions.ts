import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ShiftDetailActions {
  constructor(private store$: Store<any>) { }
  
  static ACTION_CLOSE_SHIFT = 'ACTION_CLOSE_SHIFT';
  
  closeShift(shift, data, dispatch: boolean = true): Action {
    const action = {type: ShiftDetailActions.ACTION_CLOSE_SHIFT, payload: {shift, data}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_CLOSE_SHIFT_SUCCESS = 'ACTION_CLOSE_SHIFT_SUCCESS';
  
  closeShiftSuccess(shift, dispatch: boolean = true): Action {
    const action = {type: ShiftDetailActions.ACTION_CLOSE_SHIFT_SUCCESS, payload: {shift}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_CLOSE_SHIFT_FAILED = 'ACTION_CLOSE_SHIFT_FAILED';
  
  closeShiftFailed(mess, dispatch: boolean = true): Action {
    const action = {type: ShiftDetailActions.ACTION_CLOSE_SHIFT_FAILED, payload: {mess}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_CALCULATED_SHIFT_DETAIL = 'ACTION_CALCULATED_SHIFT_DETAIL';
  
  calculatedShiftDetail(amounts, dispatch: boolean = true): Action {
    const action = {type: ShiftDetailActions.ACTION_CALCULATED_SHIFT_DETAIL, payload: {amounts}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_OPEN_SHIFT = 'ACTION_OPEN_SHIFT';
  
  openShift(shiftOpenData, dispatch: boolean = true): Action {
    const action = {type: ShiftDetailActions.ACTION_OPEN_SHIFT, payload: {shiftOpenData}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_OPEN_SHIFT_SUCCESS = 'ACTION_OPEN_SHIFT_SUCCESS';
  
  openShiftSuccess(shift, dispatch: boolean = true): Action {
    const action = {type: ShiftDetailActions.ACTION_OPEN_SHIFT_SUCCESS, payload: {shift}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_OPEN_SHIFT_FAILED = 'ACTION_OPEN_SHIFT_FAILED';
  
  openShiftFailed(mess, dispatch: boolean = true): Action {
    const action = {type: ShiftDetailActions.ACTION_OPEN_SHIFT_FAILED, payload: {mess}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
