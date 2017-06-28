import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class OrderListAddPaymentActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_NEED_ADD_PAYMENT = 'ACTION_NEED_ADD_PAYMENT';
  
  needAddPayment(order, dispatch: boolean = true): Action {
    const action = {type: OrderListAddPaymentActions.ACTION_NEED_ADD_PAYMENT, payload: {order}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
