import {List} from "immutable";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface CartCustomerState {
  inSearchCustomers: boolean;
  cartCustomers: List<any>;
  cartCustomerSearchString: string;
}

export interface CartCustomerStateRecord extends TypedRecord<any>, CartCustomerState {}

export const cartCustomerStateFactory = makeTypedFactory<CartCustomerState, CartCustomerStateRecord>(
  {
    inSearchCustomers: false,
    cartCustomers: List.of(),
    cartCustomerSearchString: null,
  }
);
