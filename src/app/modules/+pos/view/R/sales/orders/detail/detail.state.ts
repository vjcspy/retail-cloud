import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
export interface OrderDetail {
  order: Object,
  isResolvingReorder: boolean;
}

export interface OrderDetailRecord extends TypedRecord<any>, OrderDetail {}

export const orderDetailFactory = makeTypedFactory<OrderDetail, OrderDetailRecord>(
  {
    order: {},
    isResolvingReorder: false
  }
);
