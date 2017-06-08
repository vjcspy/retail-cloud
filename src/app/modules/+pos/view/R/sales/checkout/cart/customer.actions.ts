import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class CartCustomerActions {
  
  /*-------- CART --------*/
  static ACTION_SEARCH_CART_CUSTOMER     = 'ACTION_SEARCH_CART_CUSTOMER';
  static ACTION_RESOLVE_CART_CUSTOMERS   = 'ACTION_RESOLVE_CART_CUSTOMERS';
  static ACTION_UPDATE_ACTION_CART_STATE = 'ACTION_UPDATE_ACTION_CART_STATE';
  
  constructor(private store$: Store<any>) {}
  
  searchCustomer(cartCustomerSearchString: string): void {
    this.store$.dispatch({type: CartCustomerActions.ACTION_SEARCH_CART_CUSTOMER, payload: {cartCustomerSearchString}});
  }
  
  updateActionCartState(key: string, state: any) {
    this.store$.dispatch({type: CartCustomerActions.ACTION_UPDATE_ACTION_CART_STATE, payload: {state, key}})
  }
  
}
