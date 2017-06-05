import {Action, ActionReducer} from "@ngrx/store";
import {posConfigStateFactory, PosConfigStateRecord} from "./config.state";
import {PosConfigActions} from "./config.actions";

export const posConfigReducer: ActionReducer<PosConfigStateRecord> = (state: PosConfigStateRecord = posConfigStateFactory(), action: Action) => {
  switch (action.type) {
    case PosConfigActions.ACTION_INIT_POS_SETTINGS:
      return state.set('setting', action.payload)
                  .set('isResolveSetting', true);
    
    default:
      return state;
  }
};
