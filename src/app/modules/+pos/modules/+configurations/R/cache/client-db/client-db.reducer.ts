import {ActionReducer} from "@ngrx/store";
import {ConfigurationsCacheStateRecord} from "../cache.state";
import {ConfigurationsClientDbActions} from "./client-db.actions";
import {List} from "immutable";
import {RetailConfigDB} from "../../../../../database/xretail/db/retail-config";
import {PosEntitiesActions} from "../../../../../R/entities/entities.actions";
export const configurationsClientDbReducer: ActionReducer<ConfigurationsCacheStateRecord> = (state, action) => {
  switch (action.type) {
    case ConfigurationsClientDbActions.ACTION_RESOLVED_CONFIGURATIONS_ENTITIES:
      let entities = List.of(...action.payload['entities']);
      entities     = <any>entities.filterNot((e) => e.id === RetailConfigDB.getCode())
                                  .sort(
                                    (a, b) => -a['updatedAt'].localeCompare(b['updatedAt'])
                                  );
      
      return state.setIn(['clientDb', 'entities'], entities);
    
    case ConfigurationsClientDbActions.ACTION_DELETE_ENTITY:
      return state.setIn(['clientDb', 'syncing'], true);
    
    case PosEntitiesActions.ACTION_DELETE_ENTITY:
      return state.setIn(['clientDb', 'syncing'], false);
    
    default:
      return state;
  }
};
