import {ActionReducer} from "@ngrx/store";
import {OrdersStateRecord} from "../order.state";
import {ListActions} from "./list.actions";
import * as _ from 'lodash';
import {List} from "immutable";

export const listReducer: ActionReducer<OrdersStateRecord> = (state, action) => {
  switch (action.type) {
    
    case ListActions.ACTION_RESOLVED_ORDERS:
      return state.update('list', (list) => {
        return list.set('ordersGroped', action.payload['ordersGroped'])
                   .set('isResolving', false);
      });
    
    case ListActions.ACTION_CHANGE_SEARCH_DATA:
      return state.update('list', (list) => {
        _.forEach(action.payload['searchData'], (value, key) => {
          list = list.set(key, value);
        });
        
        list = list.set('isResolving', true);
        return list;
      });
    
    case ListActions.ACTION_SEARCH_ONLINE_FAILED:
      return state.update('list', (list) => {
        return list.set('ordersGroped', List.of())
                   .set('isResolving', false);
      });
    
    default:
      return state;
  }
};
