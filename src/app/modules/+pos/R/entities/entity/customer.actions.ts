import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class EntityCustomerActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_SAVE_CUSTOMER_ADDRESS = 'ACTION_SAVE_CUSTOMER_ADDRESS';
  
  saveCustomerAddress(customer, address, dispatch: boolean = true): Action {
    const action = {type: EntityCustomerActions.ACTION_SAVE_CUSTOMER_ADDRESS, payload: {customer, address}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_CUSTOMER_ADDRESS_SUCCESSFULLY = 'ACTION_SAVE_CUSTOMER_ADDRESS_SUCCESSFULLY';
  
  saveCustomerAddressSuccessfully(customer, address, dispatch: boolean = true): Action {
    const action = {type: EntityCustomerActions.ACTION_SAVE_CUSTOMER_ADDRESS_SUCCESSFULLY, payload: {customer, address}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
