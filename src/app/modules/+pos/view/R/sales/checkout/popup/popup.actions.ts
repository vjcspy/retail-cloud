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
  
  static ACTION_VIEW_CUSTOMER_OTHER_INFO = 'ACTION_VIEW_CUSTOMER_OTHER_INFO';
  
  viewCustomerOtherInfo(customer, dispatch: boolean = true): Action {
    const action = {type: CheckoutPopupActions.ACTION_VIEW_CUSTOMER_OTHER_INFO, payload: {customer}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_GET_CUSTOMER_OTHER_INFO_SUCCESS = 'ACTION_GET_CUSTOMER_OTHER_INFO_SUCCESS';
  
  getCustomerOtherInfoSuccess(customerOtherInfo, dispatch: boolean = true): Action {
    const action = {type: CheckoutPopupActions.ACTION_GET_CUSTOMER_OTHER_INFO_SUCCESS, payload: {customerOtherInfo}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_CHANGE_BILLING_TAB_VIEW = 'ACTION_CHANGE_BILLING_TAB_VIEW';
  
  changeBillingTabView(billingTabState, dispatch: boolean = true): Action {
    const action = {type: CheckoutPopupActions.ACTION_CHANGE_BILLING_TAB_VIEW, payload: {billingTabState}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
