import {ActionReducer} from "@ngrx/store";
import {ShiftStateRecord} from "../shift.state";
import {ShiftListActions} from "../list/list.actions";
import {ShiftDetailActions} from "./detail.actions";

export const shiftDetailReducer: ActionReducer<ShiftStateRecord> = (state, action) => {
  const type = action.type;
  
  if (type === ShiftListActions.ACTION_SELECT_SHIFT_DETAIL) {
    return state.setIn(['detail', 'shift'], action.payload['shift']);
  }
  
  if (type === ShiftDetailActions.ACTION_CALCULATED_SHIFT_DETAIL) {
    return state.setIn(['detail', 'amounts'], action.payload['amounts']);
  }
  
  if (type === ShiftDetailActions.ACTION_CLOSE_SHIFT) {
    return state.setIn(['detail', 'waitingServer'], true);
  }
  
  if (type === ShiftDetailActions.ACTION_CLOSE_SHIFT_SUCCESS
      || type === ShiftDetailActions.ACTION_OPEN_SHIFT_SUCCESS) {
    return state.setIn(['detail', 'waitingServer'], false)
                .set('popupOpening', null);
  }
  
  if (type === ShiftDetailActions.ACTION_CLOSE_SHIFT_FAILED
      || type === ShiftDetailActions.ACTION_CLOSE_SHIFT_FAILED) {
    return state.setIn(['detail', 'waitingServer'], false);
  }
  
  return state;
};
