import {Action, ActionReducer} from "@ngrx/store";
import {posStepStateFactory, PosStepStateRecord} from "./step.state";

export const posStepReducer: ActionReducer<PosStepStateRecord> = (state: PosStepStateRecord = posStepStateFactory(), action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
