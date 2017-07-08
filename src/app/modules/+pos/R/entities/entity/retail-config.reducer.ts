import {ActionReducer} from "@ngrx/store";
import {PosEntitiesStateRecord} from "../entities.state";
import {EntityRetailConfigActions} from "./retail-config.actions";

export const entityRetailConfigReducer: ActionReducer<PosEntitiesStateRecord> = (state, action) => {
  switch (action.type) {
    case EntityRetailConfigActions.ACTION_UPDATE_RETAIL_CONFIG:
      return state.updateIn(['retailConfig', 'items'], (items) => {
        const configIndex = items.findIndex((c) => c['key'] === action.payload['config']['key']);
        if (configIndex) {
          return items.set(configIndex, Object.assign({}, action.payload['config']));
        }
        
        return items;
      });
    
    default:
      return state;
  }
};
