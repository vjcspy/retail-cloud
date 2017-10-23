import {ActionReducer} from "@ngrx/store";
import {productStateFactory, ProductStateRecord} from "./state";
import {ProductActions} from "./actions";

export const productReducer: ActionReducer<ProductStateRecord> = (state = productStateFactory(), action) => {
  switch (action.type) {
    case ProductActions.ACTION_SAVE_PRODUCT:
      return state.set('processing', true);
    
    case ProductActions.ACTION_SAVE_PRODUCT_FAIL:
    case ProductActions.ACTION_SAVE_PRODUCT_SUCCESS:
      return state.set('processing', false);
    
    default:
      return state;
  }
};
