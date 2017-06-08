import {Action, ActionReducer} from "@ngrx/store";
import {cartTotalsStateFactory, CartTotalsStateRecord} from "./totals.state";

export const cartTotalsReducer: ActionReducer<CartTotalsStateRecord> = (state = cartTotalsStateFactory(), action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
