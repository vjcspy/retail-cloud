import {Action, ActionReducer} from "@ngrx/store";
import {PosGeneralState, posGeneralStateFactory} from "./general.state";

export const generalReducer: ActionReducer<PosGeneralState> = (state: PosGeneralState = posGeneralStateFactory(), action: Action) => {
  switch (action.payload) {
    default:
      return state;
  }
};
