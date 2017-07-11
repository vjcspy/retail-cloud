import {ActionReducer} from "@ngrx/store";
import {PosEntitiesStateRecord} from "../entities.state";
import {EntityActions} from "./entity.actions";

export const entityReducer: ActionReducer<PosEntitiesStateRecord> = (state, action) => {
  switch (action.type) {
    case EntityActions.ACTION_PUSH_ENTITY:
      const entityCode = action.payload['entityCode'];
      const primaryKey = action.payload['key'];
      
      return state.updateIn([entityCode, 'items'], (items) => {
        const itemIndex = items.findIndex((c) => c[primaryKey] === action.payload['item'][primaryKey]);
        
        return itemIndex > -1 ?
          items.set(itemIndex, Object.assign({}, action.payload['item'])) :
          items.push(Object.assign({}, action.payload['item']));
      });
    
    default:
      return state;
  }
};
