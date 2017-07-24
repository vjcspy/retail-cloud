import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {Customer} from "../../../../../core/framework/customer/Model/Customer";

export enum CheckoutPopup {
  CUSTOM_SALE = 1,
  CUSTOMER_BILLING,
  CUSTOMER_SHIPPING,
}

interface CheckoutPopupCustomerState {
  customer: Customer;
}

interface CheckoutPopupCustomerStateRecord extends TypedRecord<any>, CheckoutPopupCustomerState {}

const checkoutPopupCustomerStateFactory = makeTypedFactory<CheckoutPopupCustomerState, CheckoutPopupCustomerStateRecord>({
                                                                                                                           customer: null
                                                                                                                         });

export interface CheckoutPopupState {
  popupOpening: CheckoutPopup;
  
  customerPopup: CheckoutPopupCustomerState;
}

export interface CheckoutPopupStateRecord extends TypedRecord<any>, CheckoutPopupState {}

export const checkoutPopupStateFactory = makeTypedFactory<CheckoutPopupState, CheckoutPopupStateRecord>(
  {
    popupOpening: null,
    
    customerPopup: checkoutPopupCustomerStateFactory(),
  }
);
