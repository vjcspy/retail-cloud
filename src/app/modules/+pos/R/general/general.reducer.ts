import {Action, ActionReducer} from "@ngrx/store";
import {PosGeneralActions} from "./general.actions";
import {posGeneralStateFactory, PosGeneralStateRecord} from "./general.state";
import * as _ from 'lodash';
import {AccountActions} from "../../../../R/account/account.actions";

export const generalReducer: ActionReducer<PosGeneralStateRecord> = (state: PosGeneralStateRecord = posGeneralStateFactory(), action: Action) => {
  switch (action.type) {
    case PosGeneralActions.ACTION_SAVE_STATE:
      _.forEach(action.payload['generalData'], (v, k) => {
        state = state.set(k, v);
      });
      return state;
    
    case PosGeneralActions.ACTION_GO_OUTLET_REGISTER_PAGE:
      return state.set('redirect', action.payload['redirect']);
    
    case PosGeneralActions.ACTION_SELECT_WEBSITE:
      return state.set('baseUrl', action.payload['baseUrl']);
    
    case PosGeneralActions.ACTION_RESOLVED_URLS:
      return state.set('urls', action.payload['urls']);
    
    case AccountActions.ACTION_LOGOUT:
      return posGeneralStateFactory();
    
    default:
      return state;
  }
};
