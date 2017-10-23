import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ProductActions {
  constructor(protected store$: Store<any>) { }
  
  static ACTION_SAVE_PRODUCT = 'ACTION_SAVE_PRODUCT';
  
  saveProduct(product, dispatch: boolean = true): Action {
    const action = {type: ProductActions.ACTION_SAVE_PRODUCT, payload: {product}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_PRODUCT_SUCCESS = 'ACTION_SAVE_PRODUCT_SUCCESS';
  
  saveProductSuccess(product, dispatch: boolean = true): Action {
    const action = {type: ProductActions.ACTION_SAVE_PRODUCT_SUCCESS, payload: {product}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_PRODUCT_FAIL = 'ACTION_SAVE_PRODUCT_FAIL';
  
  saveProductFail(mess, e, dispatch: boolean = true): Action {
    const action = {type: ProductActions.ACTION_SAVE_PRODUCT_FAIL, payload: {mess, e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
