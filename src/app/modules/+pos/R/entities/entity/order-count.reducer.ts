import {ActionReducer} from "@ngrx/store";
import {EntityRecord} from "../entities.model";
import {PosConfigActions} from "../../config/config.actions";
import {List} from "immutable";
import {UserOrderCountDB} from "../../../database/xretail/db/user-order-count";

export const orderCountReducer: ActionReducer<EntityRecord> = (state, action) => {
  switch (action.type) {
    case PosConfigActions.ACTION_RETRIEVE_ORDER_COUNT:
      return state.updateIn(['userOrderCount', 'items'], (orderCounts: List<UserOrderCountDB>) => {
        const index = orderCounts.findIndex((orderCount) => orderCount['register_id'] === action.payload['orderCount']['register_id']);
        
        if (index > -1) {
          orderCounts = orderCounts.update(index, (o) => Object.assign({}, {...action.payload['orderCount']}));
        } else {
          orderCounts = orderCounts.push(action.payload['orderCount']);
        }
        
        return orderCounts;
      });
    
    default:
      return state;
  }
};
