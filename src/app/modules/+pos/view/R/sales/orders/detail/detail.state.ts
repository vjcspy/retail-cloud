import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
export interface OrderDetail {
  order: Object
}

export interface OrderDetailRecord extends TypedRecord<any>, OrderDetail {}

export const orderDetailFactory = makeTypedFactory<OrderDetail, OrderDetailRecord>(
  {
    order: {}
  }
);
