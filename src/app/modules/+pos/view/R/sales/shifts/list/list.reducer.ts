import {ActionReducer} from "@ngrx/store";
import {ShiftListActions} from "./list.actions";
import * as _ from 'lodash';
import {ShiftStateRecord} from "../shift.state";

export const shiftListReducer: ActionReducer<ShiftStateRecord> = (state: ShiftStateRecord, action) => {
  switch (action.type) {
    case ShiftListActions.ACTION_RESOLVED_SHIFT:
      return state.setIn(['list', 'shiftGroped'], action.payload['shiftGroped']);
    
    case ShiftListActions.ACTION_PULLED_SHIFT:
      let newShifts = state.list.shifts;
      _.forEach(action.payload['shifts'], (shift) => {
        let findIndex = state.list.shifts.findIndex((v) => v['id'] === shift['id']);
        if (findIndex > -1) {
          newShifts = newShifts.update(findIndex, (u) => Object.assign({}, {...u}, {...shift}));
        } else {
          newShifts = newShifts.push(Object.assign({}, {...shift}));
        }
      });
      
      return state.setIn(['list', 'shifts'], newShifts)
                  .setIn(['list', 'lastPageNumber'], action.payload['lastPageNumber']);
    
    default:
      return state;
  }
};
