import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface SalesReceipt {
  typePrint: string;
  orderOffline: Object;
  customerReceipt: any;
  merchantReceipt: any;
  emailReceipt: {
    email: string;
    name: string;
    template: string;
    isSending: boolean
  };
}

export interface SalesReceiptRecord extends TypedRecord<any>, SalesReceipt {}

export const salesReceiptFactory = makeTypedFactory<SalesReceipt, SalesReceiptRecord>(
  {
    typePrint: 'receipt', // receipt, email, gift
    orderOffline: null,
    customerReceipt: null,
    merchantReceipt: null,
    emailReceipt: {
      email: null,
      name: null,
      template: null,
      isSending: false
    }
  }
);

export interface ReceiptState {
  salesReceipt: SalesReceiptRecord
}

export interface ReceiptStateRecord extends TypedRecord<any>, ReceiptState {}

export const receiptStateFactory = makeTypedFactory<ReceiptState, ReceiptStateRecord>(
  {salesReceipt: salesReceiptFactory()}
);
