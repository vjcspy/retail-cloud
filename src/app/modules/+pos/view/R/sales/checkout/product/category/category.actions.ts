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
}
