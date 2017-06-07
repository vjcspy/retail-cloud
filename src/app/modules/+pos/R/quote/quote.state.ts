import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {Customer} from "../../core/framework/customer/Model/Customer";
import {Address} from "../../core/framework/quote/Model/Quote/Address";
import {Quote} from "../../core/framework/quote/Model/Quote";
import {PosQuote} from "./quote";
import {Product} from "../../core/framework/catalog/Model/Product";
import {DataObject} from "../../core/framework/General/DataObject";
import {List} from "immutable";

export interface PosQuoteState {
  quote: Quote;
  customer: Customer;
  shippingAdd: Address;
  billingAdd: Address;
  items: List<DataObject>;
  productSelected: { // Selected item will pass data to product detail detail
    product: Product;
    buyRequest: Object;
  };
  hasShipment: boolean;
  
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
                                                                                           shippingAdd: null,
                                                                                           billingAdd: null,
                                                                                           items: <any>List.of(),
                                                                                           productSelected: {
                                                                                             product: null,
                                                                                             buyRequest: null
                                                                                           },
                                                                                           hasShipment: false,
  
                                                                                           info: {
                                                                                             isShiftOpening: false,
                                                                                             isRefunding: false,
                                                                                             note: ""
                                                                                           },
  
                                                                                           creditmemo: null,
  
                                                                                           grandTotal: 0
                                                                                         });
