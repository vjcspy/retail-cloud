import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface CheckoutState {
  isCalculating: boolean;
  totals: Object;
  orderType: string;
  orderId: string;
  payments: List<any>;
}

export interface CheckoutSateRecord extends CheckoutState, TypedRecord<any> {

}

export const checkoutStateFactory = makeTypedFactory<CheckoutState, CheckoutSateRecord>(
  {
    isCalculating: false,
    orderId: null,
    orderType: null,
    totals: {},
    payments: List.of()
  });
