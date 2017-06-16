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
  merchantReceipt?: any;
  customerReceipt?: any;
}

export interface PaymentMethod {
  id: number; // must have id when we use it to group payment in shift detail
  type: string;
  title: string;
  amount: number;
  isChanging: boolean; // If method is changing so we can edit input
  created_at: string;
  data?: Object;
  is_purchase: boolean;
  payment_data?: Object;
  allow_amount_tendered?: boolean;
}

export interface PosStepState {
  checkoutStep: number;
  totals: {
    grandTotal: number;
    totalPaid: number;
    remain: number;
  },
  cashPaymentId: number;
  paymentMethodCanUse: List<Object>;
  paymentMethodUsed: List<PaymentMethod>;
  moneySuggestion: number[];
  isSavingOrder: boolean;
  orderOffline: Object;
  
  listPayment3rdData: List<Payment3rd>;
  isChecking3rd: boolean;
}

export interface PosStepStateRecord extends TypedRecord<any>, PosStepState {}

export const posStepStateFactory = makeTypedFactory<PosStepState, PosStepStateRecord>(
  {
    checkoutStep: CheckoutStep.NONE,
    totals: {totalPaid: 0, remain: null, grandTotal: 0},
    cashPaymentId: null,
    paymentMethodCanUse: <any>List.of(),
    paymentMethodUsed: <any>List.of(),
    moneySuggestion: [],
    isSavingOrder: false,
    orderOffline: null,
    
    listPayment3rdData: <any>List.of(),
    isChecking3rd: false,
  }
);
