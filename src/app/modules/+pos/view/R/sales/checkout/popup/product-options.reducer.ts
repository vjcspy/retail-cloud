import {Action, ActionReducer} from "@ngrx/store";
import {productOptionsStateFactory, ProductOptionsStateRecord} from "./product-options.state";
import {ProductOptionsActions} from "./product-options.actions";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";

export const productOptionsReducer: ActionReducer<ProductOptionsStateRecord> = (state = productOptionsStateFactory(), action: Action) => {
  switch (action.type) {
    case ProductOptionsActions.ACTION_CHANGE_TAB_VIEW:
      return state.set('tabView', action.payload['tabView']);
    
    case ProductOptionsActions.ACTION_RETRIEVE_PRODUCT_INFORMATION:
      return state.set('product', action.payload['product'])
                  .set('isOpenProductDetailPopup', true);
    
    case ProductOptionsActions.ACTION_UPDATE_PRODUCT_OPTION_DATA:
      if (action.payload['forceCreateNew'] === true) {
        return state.setIn(['optionData', action.payload['optionType']], action.payload['optionValue']);
      } else {
        return state.updateIn(['optionData',
                               action.payload['optionType']], (options) => Object.assign({}, {...options}, {...action.payload['optionValue']})
        );
      }
    
    case ProductOptionsActions.ACTION_RE_INIT_SUPER_ATTRIBUTE_SELECT_DATA:
      return state.set('product', action.payload['product'])
                  .setIn(['optionData', 'super_attribute'], action.payload['super_attribute']);
    
    case PosQuoteActions.ACTION_WAIT_GET_PRODUCT_OPTIONS:
      state = state.clear()
                   // TODO: clear have bug here. It will take old reference of object
                   .setIn(['optionData', 'bundle_option'], {})
                   .setIn(['optionData', 'bundle_option_qty'], {})
                   .setIn(['optionData', 'options'], {})
                   .setIn(['optionData', 'super_attribute'], {})
                   .setIn(['optionData', 'super_group'], {});
      
      return state.set('product', action.payload['product'])
                  .set('buyRequest', action.payload['buyRequest']);
    
    case PosQuoteActions.ACTION_ADD_ITEM_BUY_REQUEST_TO_QUOTE:
    case ProductOptionsActions.ACTION_CANCEL_PRODUCT_OPTIONS:
      return state.clear()
                  // TODO: clear have bug here. It will take old reference of object
                  .setIn(['optionData', 'bundle_option'], {})
                  .setIn(['optionData', 'bundle_option_qty'], {})
                  .setIn(['optionData', 'options'], {})
                  .setIn(['optionData', 'super_attribute'], {})
                  .setIn(['optionData', 'super_group'], {});
    
    default:
      return state;
  }
};
