import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface CartTotalsState {
  isOpeningPopupDiscount: boolean;
  isDiscountWholeOrderValue: boolean;
}

export interface CartTotalsStateRecord extends TypedRecord<any>, CartTotalsState {}

export const cartTotalsStateFactory = makeTypedFactory<CartTotalsState, CartTotalsStateRecord>(
  {
    isOpeningPopupDiscount: false,
    isDiscountWholeOrderValue: false,
  });
