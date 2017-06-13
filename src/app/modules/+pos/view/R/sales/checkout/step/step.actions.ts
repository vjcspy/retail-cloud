import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {PaymentMethod} from "./step.state";

@Injectable()
export class PosStepActions {
  static ACTION_BACK_CHECKOUT_PAGE = 'ACTION_BACK_CHECKOUT_PAGE';
  
  static ACTION_GET_PAYMENT_METHOD_CAN_USE = 'ACTION_GET_PAYMENT_METHOD_CAN_USE';
  
  static ACTION_ADD_PAYMENT_METHOD_TO_ORDER      = 'ACTION_ADD_PAYMENT_METHOD_TO_ORDER';
  static ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER = 'ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER';
  static ACTION_INIT_CHECKOUT_STEP_DATA          = 'ACTION_INIT_CHECKOUT_STEP_DATA';
  
  constructor(private store$: Store<any>) { }
  
  back() {
    this.store$.dispatch({type: PosStepActions.ACTION_BACK_CHECKOUT_PAGE})
  }
  
  addPaymentMethodToOrder(payment: PaymentMethod) {
    this.store$.dispatch({type: PosStepActions.ACTION_ADD_PAYMENT_METHOD_TO_ORDER, payload: {payment}});
  }
  
  removePaymentMethodFromOrder(payment: PaymentMethod) {
    this.store$.dispatch({type: PosStepActions.ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER, payload: {payment}});
  }
}
