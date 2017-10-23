import {ActionReducer} from "@ngrx/store";
import {productStateFactory, ProductStateRecord} from "./state";

export const productReducer: ActionReducer<ProductStateRecord> = (state = productStateFactory(), action) => {
  switch (action.type) {
    default:
      return state;
  }
};
