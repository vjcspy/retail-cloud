import {ActionReducer} from "@ngrx/store";
import {ShiftListRecord} from "./list.state";
import {ShiftListActions} from "./list.actions";

export const shiftListReducer: ActionReducer<ShiftListRecord> = (state, action) => {
  switch (action.type) {
    case ShiftListActions.ACTION_RESOLVED_SHIFT:
      return state.setIn(['list', 'shiftGroped'], action.payload['shiftGroped']);
    
    default:
      return state;
  }
};
