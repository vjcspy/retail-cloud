import {Action, ActionReducer} from "@ngrx/store";
import {PosPullActions} from "./pull.actions";
import {PosEntitiesActions} from "./entities.actions";
import {List} from "immutable";
import {posPullStateFactory, PosPullStateRecord} from "./pull.state";

export const pullReducer: ActionReducer<PosPullStateRecord> = (state: PosPullStateRecord = posPullStateFactory(), action: Action) => {
  switch (action.type) {
    case PosPullActions.ACTION_PULL_ENTITIES:
      return state.set('pullingChain', List.of(...action.payload['entitiesCode']))
                  .set('isPullingChain', true)
                  .set('pullingChainSuccess', List.of());
    
    case PosPullActions.ACTION_PULL_ENTITIES_FULL:
      return state.set('isPullingChain', false);
    
    case PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS:
      return state.isPullingChain === true ?
        state.update('pullingChain', (pullingChain: List<string>) => pullingChain.filter((entityCode) => entityCode !== action.payload['entityCode']))
             .update('pullingChainSuccess', (pullingChainSuccess: List<string>) => pullingChainSuccess.push(action.payload['entityCode']))
             .set('pullingEntity', null)
        : state;
    
    case PosEntitiesActions.ACTION_PULL_ENTITY_DATA_FROM_SERVER:
      return state.set('pullingEntity', action.payload['entityCode']);
    
    default:
      return state;
  }
};
