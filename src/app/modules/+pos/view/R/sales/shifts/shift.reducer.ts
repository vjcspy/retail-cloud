import {ActionReducer} from "@ngrx/store";
import {SHIFT_POPUP, shiftStateFactory, ShiftStateRecord} from "./shift.state";
import {mergeSliceReducers} from "../../../../../../R/index";
import {shiftListReducer} from "./list/list.reducer";
import {shiftDetailReducer} from "./detail/detail.reducer";
import {ShiftActions} from "./shift.actions";

const shiftMainReducer: ActionReducer<ShiftStateRecord> = (state: ShiftStateRecord, action) => {
  const type = action.type;
  
  if (type === ShiftActions.ACTION_CHANGE_STATE_POPUP) {
    if (action.payload['popupOpening'] === SHIFT_POPUP.OPEN_POPUP) {
      let lastShift = state.list.shifts.maxBy(hitter => parseInt(hitter['id']));
      if (lastShift && lastShift.hasOwnProperty('id')) {
        state = state.set('lastShift', lastShift);
      }
    }
    
    return state.set('popupOpening', action.payload['popupOpening']);
  }
  
  if (type === ShiftActions.ACTION_CLEAR_SHIFT_STATE) {
    return shiftStateFactory();
  }
  
  return state;
};

export const shiftReducer = mergeSliceReducers(shiftStateFactory(), shiftMainReducer, shiftListReducer, shiftDetailReducer);
