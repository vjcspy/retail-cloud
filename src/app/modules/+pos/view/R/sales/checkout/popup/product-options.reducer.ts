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
    
    case ProductOptionsActions.ACTION_UPDATE_PRODUCT_CUSTOMIZABLE_OPTION:
      return state.update('data', (data) => Object.assign({}, {...data}, {options: Object.assign({}, {...data['options']}, {...action.payload['options']})}));
    
    case PosQuoteActions.ACTION_WAIT_GET_PRODUCT_OPTIONS:
      state = state.clear();
      return state.set('product', action.payload['product'])
                  .set('buyRequest', action.payload['buyRequest'])
                  .set('isOpenProductDetailPopup', true);
    
    case ProductOptionsActions.ACTION_CANCEL_PRODUCT_OPTIONS:
      return state.clear();
    
    default:
      return state;
  }
};
