import {Action, ActionReducer} from "@ngrx/store";
import {cartActionBarFactory, CartActionBarRecord} from "./action-bar.state";

export const cartActionBarReducer: ActionReducer<CartActionBarRecord> = (state = cartActionBarFactory(), action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
