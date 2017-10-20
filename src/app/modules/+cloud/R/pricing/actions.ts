import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class PricingActions {
  constructor(protected store$: Store<any>) { }
  
  static ACTION_SAVE_PRICE = 'ACTION_SAVE_PRICE';
  
  savePricing(pricing, dispatch: boolean = true): Action {
    const action = {type: PricingActions.ACTION_SAVE_PRICE, payload: {pricing}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_PRICE_SUCCESS = 'ACTION_SAVE_PRICE_SUCCESS';
  
  savePricingSuccess(price, dispatch: boolean = true): Action {
    const action = {type: PricingActions.ACTION_SAVE_PRICE_SUCCESS, payload: {price}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_PRICE_FAIL = 'ACTION_SAVE_PRICE_FAIL';
  
  savePricingFail(mess, dispatch: boolean = true): Action {
    const action = {type: PricingActions.ACTION_SAVE_PRICE_FAIL, payload: {mess}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
