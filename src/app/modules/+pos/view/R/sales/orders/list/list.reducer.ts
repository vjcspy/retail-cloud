import {ActionReducer} from "@ngrx/store";
import {OrdersStateRecord} from "../order.state";
import {ListActions} from "./list.actions";
import * as _ from 'lodash';

export const listReducer: ActionReducer<OrdersStateRecord> = (state, action) => {
  switch (action.type) {
    
    case ListActions.ACTION_RESOLVED_ORDERS:
      return state.update('list', (list) => {
        return list.set('ordersGroped', action.payload['ordersGroped']);
      });
    
    case ListActions.ACTION_CHANGE_SEARCH_DATA:
      return state.update('list', (list) => {
        _.forEach(action.payload['searchData'], (value, key) => {
          list = list.set(key, value);
        });
        
        return list;
      });
    
    default:
      return state;
  }
};
