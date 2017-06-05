import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {Customer} from "../../core/framework/customer/Model/Customer";
import {Address} from "../../core/framework/quote/Model/Quote/Address";
import {List} from "immutable";
import {Quote} from "../../core/framework/quote/Model/Quote";
import {PosQuote} from "./quote";

export interface PosQuoteState {
  quote: Quote;
  customer: Customer;
  shippingAdd: Address;
  billingAdd: Address;
  items: List<any>;
  hasShipment: boolean;
  useDefaultCustomer: boolean;
  
  isRefunding: boolean;
  
  info: {
    isShiftOpening: boolean,
    note: string;
  };
  
  grandTotal: number; // Phải tính trong cả 2 trường hợp là refund và không refund
}

export interface PosQuoteStateRecord extends TypedRecord<any>, PosQuoteState {}

export const posQuoteStateFactory = makeTypedFactory<PosQuoteState, PosQuoteStateRecord>({
                                                                                           quote: PosQuote.getQuote(),
                                                                                           customer: null,
                                                                                           shippingAdd: null,
                                                                                           billingAdd: null,
                                                                                           items: List.of(),
                                                                                           hasShipment: false,
                                                                                           useDefaultCustomer: false,
  
                                                                                           isRefunding: false,
  
                                                                                           info: {
                                                                                             isShiftOpening: false,
                                                                                             note: ""
                                                                                           },
  
                                                                                           grandTotal: 0
                                                                                         });
