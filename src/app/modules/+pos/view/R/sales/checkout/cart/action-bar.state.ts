import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface CartActionBarState {
  isOpenActions: boolean;
  isOpeningNote: boolean;
  
  isOpenOrderOnhold: boolean;
  orderOnholdSearchString: string;
  orderOnhold: List<any>;
}

export interface CartActionBarRecord extends TypedRecord<any>, CartActionBarState {}

export const cartActionBarFactory = makeTypedFactory<CartActionBarState, CartActionBarRecord>(
  {
    isOpenActions: false,
    isOpeningNote: false,
    
    isOpenOrderOnhold: false,
    orderOnholdSearchString: null,
    orderOnhold: List.of()
  });
