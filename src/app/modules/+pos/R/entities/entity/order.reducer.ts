import {Action, ActionReducer} from "@ngrx/store";
import {EntityOrderActions} from "./order.actions";
import {PosEntitiesStateRecord} from "../entities.state";
import {List} from "immutable";
import {OrderDB} from "../../../database/xretail/db/order";

export const entityOrderReducer: ActionReducer<PosEntitiesStateRecord> = (state: PosEntitiesStateRecord, action: Action) => {
  const type = action.type;
  
  if (type === EntityOrderActions.ACTION_PUT_ORDER_ENTITY) {
    const key   = action.payload['key'];
    const order = action.payload['order'];
    let orderIndex;
    if (!!key) {
      orderIndex = state.orders.items.findIndex((o) => o[key] === order[key]);
    }
    let newOrderEntity = new OrderDB();
    newOrderEntity.addData(order);
    
    if (!!orderIndex) {
      return state.updateIn(['orders', 'items'], (items: List<OrderDB>) => items.update(orderIndex, () => newOrderEntity));
    } else {
      return state.updateIn(['orders', 'items'], (items: List<OrderDB>) => items.push(newOrderEntity));
    }
  }
  
  return state;
};
