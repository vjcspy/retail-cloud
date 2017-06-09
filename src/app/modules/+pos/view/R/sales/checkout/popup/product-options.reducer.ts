import {ActionReducer} from "@ngrx/store";
import {productOptionsStateFactory, ProductOptionsStateRecord} from "./product-options.state";
export const productOptionsReducer: ActionReducer<ProductOptionsStateRecord> = (state = productOptionsStateFactory(), action) => {
  switch (action.type) {
    default:
      return state;
  }
};
