import {Action, ActionReducer} from "@ngrx/store";
import {productOptionsStateFactory, ProductOptionsStateRecord} from "./product-options.state";
import {ProductOptionsActions} from "./product-options.actions";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";

export const productOptionsReducer: ActionReducer<ProductOptionsStateRecord> = (state = productOptionsStateFactory(), action: Action) => {
  switch (action.type) {
    case ProductOptionsActions.ACTION_CHANGE_TAB_VIEW:
      return state.set('tabView', action.payload['tabView']);
    
    case ProductOptionsActions.ACTION_RETRIEVE_PRODUCT_INFORMATION:
      return state.set('product', action.payload['product']);
    
    case PosQuoteActions.ACTION_WAIT_GET_PRODUCT_OPTIONS:
      state = productOptionsStateFactory();
      return state.set('product', action.payload['product'])
                  .set('buyRequest', action.payload['buyRequest'])
                  .set('isOpenProductDetailPopup', true);
    
    case ProductOptionsActions.ACTION_CANCEL_PRODUCT_OPTIONS:
      return productOptionsStateFactory();
    
    default:
      return state;
  }
};
