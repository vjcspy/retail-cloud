import {Action, ActionReducer} from "@ngrx/store";
import {cartItemStateFactory, CartItemStateRecord} from "./item.state";

export const cartItemReducer: ActionReducer<CartItemStateRecord> = (state = cartItemStateFactory(), action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
