import {Action, ActionReducer} from "@ngrx/store";
import {CheckoutProductStateRecord} from "../product.state";
import {CheckoutProductCategoryActions} from "./category.actions";

export const checkoutProductCategoryReducer: ActionReducer<CheckoutProductStateRecord> = (state: CheckoutProductStateRecord, action: Action) => {
  const type = action.type;
  if (type === CheckoutProductCategoryActions.ACTION_SAVE_CATEGORY_HEIGHT) {
    state = state.set('categoryHeight', Object.assign({}, {...state.categoryHeight}, action.payload['categoryHeight']));
    
    return state.set('productsStyles', calculateProductStyles(state));
  }
  
  if (type === CheckoutProductCategoryActions.ACTION_TOGGLE_CATEGORY) {
    return state.set('isCategoryMode', action.payload['isCategoryMode']);
  }
  
  if (type === CheckoutProductCategoryActions.ACTION_SELECT_CATEGORY) {
    return state.set('currentCategory', action.payload['currentCategory']);
  }
  
  if (type === CheckoutProductCategoryActions.ACTION_RESOLVED_CATEGORY_LIST) {
    return state.set('categoryList', action.payload['categoryList']);
  }
  
  return state;
};

function calculateProductStyles(state: CheckoutProductStateRecord) {
  return {height: `calc(100% - ${state.categoryHeight['totalCategoryHeight'] + 10}px)`};
}
