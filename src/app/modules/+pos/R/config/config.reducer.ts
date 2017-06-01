import {Action, ActionReducer} from "@ngrx/store";
import {posConfigStateFactory, PosConfigStateRecord} from "./config.state";

export const posConfigReducer: ActionReducer<PosConfigStateRecord> = (state: PosConfigStateRecord = posConfigStateFactory(), action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
