import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {CheckoutPopup} from "./popup.state";

@Injectable()
export class CheckoutPopupActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_CHECKOUT_OPEN_POPUP = 'ACTION_CHECKOUT_OPEN_POPUP';
  
  checkoutOpenPopup(popupOpening: CheckoutPopup, data: Object = {}, dispatch: boolean = true): Action {
    const action = {type: CheckoutPopupActions.ACTION_CHECKOUT_OPEN_POPUP, payload: {popupOpening, data}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_ADD_EDIT_CUSTOMER_ADDRESS = 'ACTION_ADD_NEW_CUSTOMER_ADDRESS';
  
  addNewCustomerAddress(editAddress = {}, dispatch: boolean = true): Action {
    const action = {type: CheckoutPopupActions.ACTION_ADD_EDIT_CUSTOMER_ADDRESS, payload: {editAddress}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
