import {Action, ActionReducer} from "@ngrx/store";
import {PosEntitiesStateRecord} from "../entities.state";

export const realtimeReducer: ActionReducer<PosEntitiesStateRecord> = (state: PosEntitiesStateRecord, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
