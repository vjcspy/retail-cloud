import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Customer} from "../../../../../core/framework/customer/Model/Customer";

@Injectable()
export class CheckoutPopupActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_CHECKOUT_OPEN_POPUP = 'ACTION_CHECKOUT_OPEN_POPUP';
  
  checkoutOpenPopup(popupOpening, dispatch: boolean = true): Action {
    const action = {type: CheckoutPopupActions.ACTION_CHECKOUT_OPEN_POPUP, payload: {popupOpening}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_OPEN_POPUP_CUSTOMER = 'ACTION_OPEN_POPUP_CUSTOMER';
  
  openPopupBillingAddress(customer: Customer, type: string = 'billing', dispatch: boolean = true): Action {
    const action = {type: CheckoutPopupActions.ACTION_OPEN_POPUP_CUSTOMER, payload: {customer, type}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
