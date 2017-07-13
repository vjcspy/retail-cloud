import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ConfigurationsPaymentActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_SAVE_PAYMENT = 'ACTION_SAVE_PAYMENT';
  
  savePayment(payments, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsPaymentActions.ACTION_SAVE_PAYMENT, payload: {payments}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_RESOLVE_PAYMENT_SNAPSHOT = 'ACTION_RESOLVE_PAYMENT_SNAPSHOT';
  
  resolvePaymentSnapshot(payments, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsPaymentActions.ACTION_RESOLVE_PAYMENT_SNAPSHOT, payload: {payments}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_PAYMENT_SUCCESS = 'ACTION_SAVE_PAYMENT_SUCCESS';
  
  savePaymentSuccess(payments, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsPaymentActions.ACTION_SAVE_PAYMENT_SUCCESS, payload: {payments}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_PAYMENT_FAILED = 'ACTION_SAVE_PAYMENT_FAILED';
  
  savePaymentFailed(mess, e, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsPaymentActions.ACTION_SAVE_PAYMENT_FAILED, payload: {mess, e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
