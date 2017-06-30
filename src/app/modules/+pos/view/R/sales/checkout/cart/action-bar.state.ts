import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface CartActionBarState {
  isOpenActions: boolean;
  isOpeningNote: boolean;
}

export interface CartActionBarRecord extends TypedRecord<any>, CartActionBarState {}

export const cartActionBarFactory = makeTypedFactory<CartActionBarState, CartActionBarRecord>(
  {
    isOpenActions: false,
    isOpeningNote: false,
  });
