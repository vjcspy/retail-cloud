import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ShiftListActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_RESOLVED_SHIFT = 'ACTION_RESOLVED_SHIFT';
  
  resolvedShift(shiftGroped, dispatch: boolean = true): Action {
    const action = {type: ShiftListActions.ACTION_RESOLVED_SHIFT, payload: {shiftGroped}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SELECT_SHIFT_DETAIL = 'ACTION_SELECT_SHIFT_DETAIL';
  
  selectShiftDetail(shift, dispatch: boolean = true): Action {
    const action = {type: ShiftListActions.ACTION_SELECT_SHIFT_DETAIL, payload: {shift}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_PULLED_SHIFT = 'ACTION_PULLED_SHIFT';
  
  pulledShift(shifts, lastPageNumber, dispatch: boolean = true): Action {
    const action = {type: ShiftListActions.ACTION_PULLED_SHIFT, payload: {shifts, lastPageNumber}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}