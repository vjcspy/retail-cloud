import {ActionReducer} from "@ngrx/store";
import {ShiftListActions} from "./list.actions";
import * as _ from 'lodash';
import {ShiftStateRecord} from "../shift.state";
import {ShiftDetailActions} from "../detail/detail.actions";
import {List} from "immutable";

export const shiftListReducer: ActionReducer<ShiftStateRecord> = (state: ShiftStateRecord, action) => {
  switch (action.type) {
    case ShiftListActions.ACTION_RESOLVED_SHIFT:
      return state.setIn(['list', 'shiftGroped'], action.payload['shiftGroped']);
    
    case ShiftListActions.ACTION_PULLED_SHIFT:
      let newShifts = List.of();
      if (action.payload['isFirstPage'] !== true) {
        newShifts = state.list.shifts;
      }
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
    
    case ShiftDetailActions.ACTION_CLOSE_SHIFT_SUCCESS:
    case ShiftDetailActions.ACTION_ADJUST_SHIFT_SUCCESS:
      const shiftIndex = state.list.shifts.findIndex((s) => parseInt(s['id']) === parseInt(action.payload['shift']['id']));
      if (shiftIndex > -1) {
        state = state.updateIn(['list', 'shifts'], (shifts) => shifts.set(shiftIndex, action.payload['shift']));
      }
      
      return state;
    
    case ShiftDetailActions.ACTION_OPEN_SHIFT_SUCCESS:
      return state.updateIn(['list', 'shifts'], (shifts) => shifts.push(action.payload['shift']));
    
    default:
      return state;
  }
};
