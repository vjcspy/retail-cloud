import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
export enum CheckoutPopup {
  CUSTOM_SALE = 1,
}

export interface CheckoutPopupState {
  popupOpening: CheckoutPopup;
}

export interface CheckoutPopupStateRecord extends TypedRecord<any>, CheckoutPopupState {}

export const checkoutPopupStateFactory = makeTypedFactory<CheckoutPopupState, CheckoutPopupStateRecord>(
  {
    popupOpening: null
  }
);
