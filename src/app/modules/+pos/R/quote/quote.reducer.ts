import {Action} from "@ngrx/store";
import {QuoteState} from "./quote.state";

export const quoteReducer = (state: QuoteState = {items: []}, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
