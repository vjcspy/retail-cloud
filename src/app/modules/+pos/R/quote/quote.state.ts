import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {Customer} from "../../core/framework/customer/Model/Customer";
import {Address} from "../../core/framework/quote/Model/Quote/Address";
import {Quote} from "../../core/framework/quote/Model/Quote";
import {PosQuote} from "./quote";
import {DataObject} from "../../core/framework/General/DataObject";
import {List} from "immutable";

export interface PosQuoteState {
  quote: Quote;
  customer: Customer;
  referenceNumber: string;
  shippingAdd: Address;
  billingAdd: Address;
  items: List<DataObject>;
  hasShipment: boolean;
  shippingAmount: number;
  
  info: {
    isShiftOpening: boolean,
    isRefunding: boolean;
    note: string;
  };
  
  creditmemo: Object;
  
  grandTotal: number; // Phải tính trong cả 2 trường hợp là refund và không refund
}

export interface PosQuoteStateRecord extends TypedRecord<any>, PosQuoteState {}

export const posQuoteStateFactory = makeTypedFactory<PosQuoteState, PosQuoteStateRecord>({
                                                                                           quote: PosQuote.getQuote(),
                                                                                           customer: null,
                                                                                           referenceNumber: "",
                                                                                           shippingAdd: null,
                                                                                           billingAdd: null,
                                                                                           items: <any>List.of(),
                                                                                           hasShipment: false,
                                                                                           shippingAmount: 0,
  
                                                                                           info: {
                                                                                             isShiftOpening: true,
                                                                                             isRefunding: false,
                                                                                             note: ""
                                                                                           },
  
                                                                                           creditmemo: null,
  
                                                                                           grandTotal: 0
                                                                                         });
