import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ShiftDetailActions {
  constructor(private store$: Store<any>) { }
  
  static ACTION_CLOSE_SHIFT = 'ACTION_CLOSE_SHIFT';
  
  closeShift(shift, dispatch: boolean = true): Action {
    const action = {type: ShiftDetailActions.ACTION_CLOSE_SHIFT, payload: {shift}};
    
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
}
