import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class CheckoutProductCategoryActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_TOGGLE_CATEGORY = 'ACTION_TOGGLE_CATEGORY';
  
  toggleCategory(isCategoryMode: boolean, dispatch: boolean = true): Action {
    const action = {type: CheckoutProductCategoryActions.ACTION_TOGGLE_CATEGORY, payload: {isCategoryMode}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_CATEGORY_HEIGHT = 'ACTION_SAVE_CATEGORY_HEIGHT';
  
  saveCategoryHeight(categoryHeight, dispatch: boolean = true): Action {
    const action = {type: CheckoutProductCategoryActions.ACTION_SAVE_CATEGORY_HEIGHT, payload: {categoryHeight}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SELECT_CATEGORY = 'ACTION_SELECT_CATEGORY';
  
  selectCategory(currentCategory, dispatch: boolean = true): Action {
    const action = {type: CheckoutProductCategoryActions.ACTION_SELECT_CATEGORY, payload: {currentCategory}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_BACK_CATEGORY = 'ACTION_BACK_CATEGORY';
  
  backCategory(dispatch: boolean = true): Action {
    const action = {type: CheckoutProductCategoryActions.ACTION_BACK_CATEGORY, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_RESOLVED_CATEGORY_LIST = 'ACTION_RESOLVED_CATEGORY_LIST';
  
  resolvedCategoryList(categoryList, categoryBreadcrumb, dispatch: boolean = true): Action {
    const action = {type: CheckoutProductCategoryActions.ACTION_RESOLVED_CATEGORY_LIST, payload: {categoryList, categoryBreadcrumb}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
