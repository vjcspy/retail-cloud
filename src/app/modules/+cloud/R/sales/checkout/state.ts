import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface CheckoutState {
  isCalculating: boolean;
  totals: Object;
  
  payments: List<any>;
}

export interface CheckoutSateRecord extends CheckoutState, TypedRecord<any> {

}

export const checkoutStateFactory = makeTypedFactory<CheckoutState, CheckoutSateRecord>(
  {
    isCalculating: false,
    totals: {
      credit: {
        creditPlan: 0,
        creditExtraUser: 0,
      },
      total: {
        costNewPlan: 0,
        costExtraUser: 0,
        discount: 0,
        grandTotal: 0
      },
    },
    payments: List.of()
  });
