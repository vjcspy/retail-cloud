import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
export interface CartItemState {
  cartItemsStyle: Object;
  cartItemRowSelected: number;
}

export interface CartItemStateRecord extends TypedRecord<any>, CartItemState {}

export const cartItemStateFactory = makeTypedFactory<CartItemState, CartItemStateRecord>(
  {
    cartItemsStyle: {},
    cartItemRowSelected: -1,
  });
