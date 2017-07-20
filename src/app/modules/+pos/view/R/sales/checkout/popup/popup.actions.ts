import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

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
}
