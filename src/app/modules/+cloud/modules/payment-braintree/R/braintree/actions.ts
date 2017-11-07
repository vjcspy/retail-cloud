import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class BraintreeActions {
  
  constructor(protected store$: Store<any>) { }
  
  static ACTION_BRAINTREE_DROPIN_CREATE = 'ACTION_BRAINTREE_DROPIN_CREATE';
  
  dropinCreate(button: Element, dispatch: boolean = true): Action {
    const action = {type: BraintreeActions.ACTION_BRAINTREE_DROPIN_CREATE, payload: {button}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_BRAINTREE_DROPIN_CREATE_SUCCESS = 'ACTION_BRAINTREE_DROPIN_CREATE_SUCCESS';
  
  dropinCreateSuccess(dispatch: boolean = true): Action {
    const action = {type: BraintreeActions.ACTION_BRAINTREE_DROPIN_CREATE_SUCCESS, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
