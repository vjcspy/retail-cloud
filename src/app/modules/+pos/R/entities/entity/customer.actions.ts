import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class EntityCustomerActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_SAVE_CUSTOMER_ADDRESS = 'ACTION_SAVE_CUSTOMER_ADDRESS';
  
  saveCustomerAddress(customer, address, addressType = 'billing', dispatch: boolean = true): Action {
    const action = {type: EntityCustomerActions.ACTION_SAVE_CUSTOMER_ADDRESS, payload: {customer, address, addressType}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_CUSTOMER_ADDRESS_SUCCESSFULLY = 'ACTION_SAVE_CUSTOMER_ADDRESS_SUCCESSFULLY';
  
  saveCustomerAddressSuccessfully(customer, addressType = 'billing', dispatch: boolean = true): Action {
    const action = {type: EntityCustomerActions.ACTION_SAVE_CUSTOMER_ADDRESS_SUCCESSFULLY, payload: {customer, addressType}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_CUSTOMER_ADDRESS_FAILED = 'ACTION_SAVE_CUSTOMER_ADDRESS_FAILED';
  
  saveCustomerAddressFailed(mess, e, dispatch: boolean = true): Action {
    const action = {type: EntityCustomerActions.ACTION_SAVE_CUSTOMER_ADDRESS_FAILED, payload: {mess, e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
