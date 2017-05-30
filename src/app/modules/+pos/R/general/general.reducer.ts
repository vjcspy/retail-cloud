import {Action, ActionReducer} from "@ngrx/store";
import {PosGeneralActions} from "./general.actions";
import {posGeneralStateFactory, PosGeneralStateRecord} from "./general.state";

export const generalReducer: ActionReducer<PosGeneralStateRecord> = (state: PosGeneralStateRecord = posGeneralStateFactory(), action: Action) => {
  switch (action.type) {
    case PosGeneralActions.ACTION_SELECT_OUTLET:
      return state.set('outlet', action.payload)
                  .set('store', {id: 1});
    
    case PosGeneralActions.ACTION_SELECT_REGISTER:
      return state.set('register', action.payload);
    
    case PosGeneralActions.ACTION_SELECT_WEBSITE:
      return state.set('baseUrl', action.payload['baseUrl']);
    
    default:
      return state;
  }
};
