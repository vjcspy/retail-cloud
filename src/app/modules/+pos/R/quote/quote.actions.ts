import {Injectable} from '@angular/core';
import {Customer} from "../../core/framework/customer/Model/Customer";
import {Store} from "@ngrx/store";

@Injectable()
export class PosQuoteActions {
  
  static ACTION_ADD_ITEM_TO_QUOTE        = 'ACTION_ADD_ITEM_TO_QUOTE';
  static ACTION_SET_CUSTOMER_TO_QUOTE    = 'ACTION_SET_CUSTOMER_TO_QUOTE';
  static ACTION_SET_SHIPPING_ADDRESS     = 'ACTION_SET_SHIPPING_ADDRESS';
  static ACTION_SET_BILLING_ADDRESS      = 'ACTION_SET_BILLING_ADDRESS';
  static ACTION_SET_SHIPPING_INFORMATION = 'ACTION_SET_SHIPPING_INFORMATION';
  
  static ACTION_RESOLVE_QUOTE = 'ACTION_RESOLVE_QUOTE';
  
  constructor(private store: Store<any>) {}
  
  setCustomerToQuote(customer: Customer): void {
    this.store.dispatch({type: PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE, payload: {customer}});
  }
}
