import {posAssignFactory, PosAssignStateRecord} from "./assign.state";
import {Action, ActionReducer} from "@ngrx/store";
import {PosAssignActions} from "./assign.actions";
import {List} from "immutable";

export const posAssignReducer: ActionReducer<PosAssignStateRecord> = (state: PosAssignStateRecord = posAssignFactory(), action: Action) => {
  switch (action.type) {
    case PosAssignActions.ACTION_ASSIGN_DATA_TO_CORE:
      return state.update('assignData', (assign: List<string>) => assign.push(action.payload['entityCode']));
    
    default:
      return state;
  }
};
