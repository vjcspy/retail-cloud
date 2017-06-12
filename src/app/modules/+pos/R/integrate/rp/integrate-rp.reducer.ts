import {integrateRpStateFactory, IntegrateRpStateRecord} from "./integrate-rp.state";
import {Action, ActionReducer} from "@ngrx/store";
import {IntegrateRpActions} from "./integrate-rp.actions";

export const integrateRpReducer: ActionReducer<IntegrateRpStateRecord> = (state: IntegrateRpStateRecord = integrateRpStateFactory(), action: Action) => {
  switch (action.type) {
    case IntegrateRpActions.ACTION_USE_REWARD_POINT:
      return state.set('isUsingPoint', true).update('rpData', (rpData) => Object.assign({}, {...rpData}, {...action.payload['rpData']}));
    
    case IntegrateRpActions.ACTION_REMOVE_REWARD_POINT:
      return state.set('isUsingPoint', false).set('rpData', null);
    
    default:
      return state;
  }
};
