import {Action} from "@ngrx/store";
export interface QuoteState {
  customer?: Object;
  shippingAdd?: Object;
  billingAdd?: Object;
  items: any[];
  hasShipment?: boolean;
}

export const quoteReducer = (state: QuoteState = {items: []}, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
