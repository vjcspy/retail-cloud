import {Action, ActionReducer} from "@ngrx/store";
import {PosGeneralActions} from "./general.actions";
import {posGeneralStateFactory, PosGeneralStateRecord} from "./general.state";
import * as _ from 'lodash';

export const generalReducer: ActionReducer<PosGeneralStateRecord> = (state: PosGeneralStateRecord = posGeneralStateFactory(), action: Action) => {
  switch (action.type) {
    case PosGeneralActions.ACTION_SAVE_STATE:
      let newState = state;
      _.forEach(action.payload, (v, k) => {
        newState = newState.set(k, v);
      });
      return newState;
    case PosGeneralActions.ACTION_SELECT_WEBSITE:
      return state.set('baseUrl', action.payload['baseUrl']);
      
    default:
      return state;
  }
};
