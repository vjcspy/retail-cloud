import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export enum CheckoutStep{
  NONE = 0,
  PAYMENT,
  COMPLETE
}

export interface PosStepState {
  checkoutStep: number;
  totals: {
    totalPaid: number;
    remain: number;
  },
  paymentMethodCanUse: Object[],
  paymentMethodUse: Object[]
}

export interface PosStepStateRecord extends TypedRecord<any>, PosStepState {}

export const posStepStateFactory = makeTypedFactory<PosStepState, PosStepStateRecord>(
  {
    checkoutStep: CheckoutStep.NONE,
    totals: {totalPaid: 0, remain: null},
    paymentMethodCanUse: [],
    paymentMethodUse: []
  }
);
