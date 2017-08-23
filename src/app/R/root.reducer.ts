import {Action, ActionReducer} from "@ngrx/store";
import {RootState, rootStateFactory, RootStateRecord} from "./root.state";
import {RootActions} from "./root.actions";

export const rootReducer: ActionReducer<RootState> = (state: RootStateRecord = rootStateFactory(), action: Action) => {
  switch (action.type) {
    case RootActions.UPDATE_NETWORK_STATUS:
      return state.set('online', action.payload['online']);
    
    default:
      return state;
  }
};
