import {ActionReducer} from "@ngrx/store";
import {ShiftStateRecord} from "../shift.state";
import {ShiftListActions} from "../list/list.actions";

export const shiftDetailReducer: ActionReducer<ShiftStateRecord> = (state, action) => {
  const type = action.type;
  
  if (type === ShiftListActions.ACTION_SELECT_SHIFT_DETAIL) {
    return state.setIn(['detail', 'shift'], action.payload['shift']);
  }
  
  return state;
};
