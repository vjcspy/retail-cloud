import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface CartTotalsState {
  isOpenTotalBlock: boolean;
  isOpeningPopupDiscount: boolean;
  isDiscountWholeOrderValue: boolean;
}

export interface CartTotalsStateRecord extends TypedRecord<any>, CartTotalsState {}

export const cartTotalsStateFactory = makeTypedFactory<CartTotalsState, CartTotalsStateRecord>(
  {
    isOpenTotalBlock: false,
    isOpeningPopupDiscount: false,
    isDiscountWholeOrderValue: false,
  });
