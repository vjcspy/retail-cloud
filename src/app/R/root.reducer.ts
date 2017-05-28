import {Action, ActionReducer} from "@ngrx/store";
import {RootState, rootStateFactory, RootStateRecord} from "./root.state";
import {Record} from "immutable";

export const rootReducer: ActionReducer<RootState> = (state: RootStateRecord = rootStateFactory(), action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
