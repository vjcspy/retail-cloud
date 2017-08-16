import {ActionReducer} from "@ngrx/store";
import {ListActions} from "../list/list.actions";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {OrderDB} from "../../../../../database/xretail/db/order";
import {OrdersStateRecord} from "../order.state";
import {RealtimeActions} from "../../../../../R/entities/realtime/realtime.actions";
import * as _ from 'lodash';
import {OrderDetailActions} from "./detail.actions";

export const orderDetailReducer: ActionReducer<OrdersStateRecord> = (state: OrdersStateRecord, action) => {
  switch (action.type) {
    
    case ListActions.ACTION_SELECT_ORDER_DETAIL:
      return state.update('detail', (detail) => {
        return detail.set('order', action.payload['order'])
                     .set('isResolvingReorder', false);
      });
    
    case PosQuoteActions.ACTION_REORDER:
      return state.update('detail', (detail) => {
        return detail.set('isResolvingReorder', true);
      });
    case PosQuoteActions.ACTION_RESOLVE_QUOTE:
      return state.update('detail', (detail) => {
        return detail.set('isResolvingReorder', false);
      });
    
    case RealtimeActions.ACTION_REALTIME_UPDATED_ENTITY_DB:
      if (action.payload['entityCode'] === OrderDB.getCode()) {
        const itemsData = action.payload['itemsData']['items'];
        _.forEach(itemsData, (updateOrder) => {
          if (parseInt(updateOrder['retail_id']) === parseInt(state.detail.order['retail_id'])) {
            state = state.update('detail', (detail) => {
              return detail.set('order', updateOrder);
            });
            
            return false;
          }
        });
      }
      return state;
    
    case OrderDetailActions.ACTION_SHIP_ORDER:
    case OrderDetailActions.ACTION_SHIP_ORDER_FAILED:
      return state.update('detail', (detail) => {
        return detail.set('isResolvingReorder', true);
      });
    
    default:
      return state;
  }
};
