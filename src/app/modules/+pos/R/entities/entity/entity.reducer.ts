import {ActionReducer} from "@ngrx/store";
import {PosEntitiesStateRecord} from "../entities.state";
import {EntityActions} from "./entity.actions";
import * as _ from 'lodash';

export const entityReducer: ActionReducer<PosEntitiesStateRecord> = (state, action) => {
  const type = action.type;
  
  if (type === EntityActions.ACTION_PUSH_ENTITY) {
    const entityCode = action.payload['entityCode'];
    const primaryKey = action.payload['key'];
    
    return state.updateIn([entityCode, 'items'], (items) => {
      let itemIndex;
      if (primaryKey) {
        itemIndex = items.findIndex((c) => c[primaryKey] === action.payload['item'][primaryKey]);
      }
      
      return itemIndex > -1 ?
        items.set(itemIndex, Object.assign({}, action.payload['item'])) :
        items.push(Object.assign({}, action.payload['item']));
    });
  }
  
  if (type === EntityActions.ACTION_PUSH_MANY_ENTITY) {
    const entityCode = action.payload['entityCode'];
    const primaryKey = action.payload['key'];
    
    _.forEach(action.payload['items'], (item) => {
      state = state.updateIn([entityCode, 'items'], (items) => {
        let itemIndex;
        if (primaryKey) {
          itemIndex = items.findIndex((c) => c[primaryKey] === item[primaryKey]);
        }
        
        return itemIndex > -1 ?
          items.set(itemIndex, Object.assign({}, item)) :
          items.push(Object.assign({}, item));
      });
    });
    
    return state;
  }
  
  return state;
};
