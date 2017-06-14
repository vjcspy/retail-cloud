import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export enum CheckoutStep{
  NONE = 0,
  PAYMENT,
  COMPLETE
}

export interface Payment3rd {
  type: string;
  inUse: boolean;
  isPaySuccess: boolean;
  additionData: Object;
}

export interface PaymentMethod {
  type: string,
  title: string,
  time: number,
  amount: number,
  isChanging: boolean, // If method is changing so we can edit input
  created_at: string,
  data: Object,
  payment_data: Object,
  allow_amount_tendered: boolean;
}

export interface PosStepState {
  checkoutStep: number;
  totals: {
    grandTotal: number;
    totalPaid: number;
    remain: number;
  },
  paymentMethodCanUse: List<Object>;
  paymentMethodUsed: List<PaymentMethod>;
  moneySuggestion: number[];
  isSavingOrder: boolean;
  
  listPayment3rdData: List<Payment3rd>;
  isChecking3rd: boolean;
}

export interface PosStepStateRecord extends TypedRecord<any>, PosStepState {}

export const posStepStateFactory = makeTypedFactory<PosStepState, PosStepStateRecord>(
  {
    checkoutStep: CheckoutStep.NONE,
    totals: {totalPaid: 0, remain: null, grandTotal: 0},
    paymentMethodCanUse: <any>List.of(),
    paymentMethodUsed: <any>List.of(),
    moneySuggestion: [],
    isSavingOrder: false,
    
    listPayment3rdData: <any>List.of(),
    isChecking3rd: false,
  }
);
