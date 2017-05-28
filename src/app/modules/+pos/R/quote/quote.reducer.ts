import {Action} from "@ngrx/store";
import {PosQuoteState} from "./quote.state";

export const quoteReducer = (state: PosQuoteState = {items: []}, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
