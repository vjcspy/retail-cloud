import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export enum CartActionBarPopup {
  POPUP_NOTE = 1,
  POPUP_ORDER_ONHOLD,
}

export interface CartActionBarState {
  isOpenActions: boolean;
  isOpeningPopup: CartActionBarPopup;
  
  orderOnholdSearchString: string;
  orderOnhold: List<any>;
}

export interface CartActionBarRecord extends TypedRecord<any>, CartActionBarState {}

export const cartActionBarFactory = makeTypedFactory<CartActionBarState, CartActionBarRecord>(
  {
    isOpenActions: false,
    isOpeningPopup: null,
    
    orderOnholdSearchString: null,
    orderOnhold: List.of()
  });
