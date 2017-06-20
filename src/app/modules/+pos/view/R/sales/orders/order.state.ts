import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {orderListFactory, OrderListRecord} from "./list/list.state";
import {orderDetailFactory, OrderDetailRecord} from "./detail/detail.state";

export interface OrdersState {
  list: OrderListRecord;
  detail: OrderDetailRecord
}
export interface OrdersStateRecord extends TypedRecord<any>, OrdersState {}

export const ordersStateFactory = makeTypedFactory<OrdersState, OrdersStateRecord>(
  {
    list: orderListFactory(),
    detail: orderDetailFactory()
  }
);
