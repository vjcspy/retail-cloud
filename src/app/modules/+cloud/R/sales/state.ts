import {CheckoutState, checkoutStateFactory} from "./checkout/state";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface SalesState {
  checkout: CheckoutState;
}

export interface SalesStateRecord extends SalesState, TypedRecord<any> {}

export const salesStateFactory = makeTypedFactory<SalesState, SalesStateRecord>(
  {
    checkout: checkoutStateFactory()
  });
