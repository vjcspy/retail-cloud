import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface SalesReceipt {
  typePrint: string;
  orderOffline: Object;
  customerReceipt: any;
  merchantReceipt: any;
}

export interface SalesReceiptRecord extends TypedRecord<any>, SalesReceipt {}

export const salesReceiptFactory = makeTypedFactory<SalesReceipt, SalesReceiptRecord>(
  {
    typePrint: 'receipt',
    orderOffline: null,
    customerReceipt: null,
    merchantReceipt: null
  }
);

export interface ReceiptState {
  salesReceipt: SalesReceiptRecord
}

export interface ReceiptStateRecord extends TypedRecord<any>, ReceiptState {}

export const receiptStateFactory = makeTypedFactory<ReceiptState, ReceiptStateRecord>(
  {salesReceipt: salesReceiptFactory()}
);
