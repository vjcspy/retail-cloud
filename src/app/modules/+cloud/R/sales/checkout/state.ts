import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface CheckoutState {
  isCalculating: boolean;
  totals: Object;
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
        discountCredit: 0,
        grandTotal: 0
      }
    }
  });
