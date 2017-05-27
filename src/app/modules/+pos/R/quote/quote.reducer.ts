import {Action} from "@ngrx/store";
export interface QuoteState {
  items: any[];
}

export const quoteReducer = (state: QuoteState = {items: []}, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
