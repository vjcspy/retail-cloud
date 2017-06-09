import {Action, ActionReducer} from "@ngrx/store";
import {cartItemStateFactory, CartItemStateRecord} from "./item.state";
import {CartItemActions} from "./item.actions";

export const cartItemReducer: ActionReducer<CartItemStateRecord> = (state = cartItemStateFactory(), action: Action) => {
  switch (action.type) {
    case CartItemActions.ACTION_CHANGE_ROW_SELECTED:
      return state.set('cartItemRowSelected', action.payload['cartItemRowSelected']);
    
    default:
      return state;
  }
};
