import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

// Dùng trong service hoặc component... Không thể sửa giá trị
export interface CheckoutState {
  isCategoryMode: boolean;
}

// Typed thực sự của state dùng trong reducer
export interface CheckoutStateRecord extends TypedRecord<any>, CheckoutState {}

export const checkoutStateFactory = makeTypedFactory<CheckoutState, CheckoutStateRecord>({
                                                                                           isCategoryMode: false
                                                                                         });

export interface SalesState {
  checkout: CheckoutState;
}

export interface SalesStateRecord extends TypedRecord<any>, SalesState {}

export const salesStateFactory = makeTypedFactory<SalesState, SalesStateRecord>({
                                                                                  checkout: checkoutStateFactory()
                                                                                });
