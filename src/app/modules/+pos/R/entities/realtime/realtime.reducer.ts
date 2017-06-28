import {Action, ActionReducer} from "@ngrx/store";
import {PosEntitiesStateRecord} from "../entities.state";
import {RealtimeActions} from "./realtime.actions";
import {Entity} from "../entities.model";
import {List} from "immutable";
import * as _ from 'lodash';

export const realtimeReducer: ActionReducer<PosEntitiesStateRecord> = (state: PosEntitiesStateRecord, action: Action) => {
  const type = action.type;
  if (type === RealtimeActions.ACTION_REALTIME_REMOVED_ENTITY_DB) {
    const entity: Entity           = state[action.payload['entityCode']];
    const needRemove: List<string> = action.payload['needRemove'];
    
    return state.updateIn([entity.entityCode, 'items'], (items: List<any>) => {
      return items.filter((item) => {
        return needRemove.indexOf(item[entity.entityPrimaryKey]) === -1;
      });
    });
  }
  
  if (type === RealtimeActions.ACTION_REALTIME_UPDATED_ENTITY_DB) {
    const entity: Entity           = state[action.payload['entityCode']];
    const needUpdate: List<string> = action.payload['needUpdate'];
    const itemsData                = action.payload['itemsData'];
    
    if (itemsData.hasOwnProperty('items') && _.isArray(itemsData['items'])) {
      return state.updateIn([entity.entityCode, 'items'], (items: List<any>) => {
        items = <any>items.filter((item) => {
          return needUpdate.indexOf(item[entity.entityPrimaryKey]) === -1;
        });
        
        _.forEach(itemsData['items'], (item: string) => {
          let cloneFist = _.clone(items.first());
          
          if (cloneFist) {
            items = items.push(cloneFist.addData(item));
          }
        });
        
        return items;
      });
    }
  }
  
  return state;
};
