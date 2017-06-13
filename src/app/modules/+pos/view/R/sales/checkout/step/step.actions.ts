import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {PaymentMethod} from "./step.state";

@Injectable()
export class PosStepActions {
  static ACTION_BACK_CHECKOUT_PAGE = 'ACTION_BACK_CHECKOUT_PAGE';
  
  // get payment can use from DB
  static ACTION_GET_PAYMENT_METHOD_CAN_USE = 'ACTION_GET_PAYMENT_METHOD_CAN_USE';
  
  // Use select payment method, which want to add to order
  static ACTION_USER_SELECT_PAYMENT_METHOD       = 'ACTION_USER_SELECT_PAYMENT_METHOD';
  // System add payment to order
  static ACTION_ADD_PAYMENT_METHOD_TO_ORDER      = 'ACTION_ADD_PAYMENT_METHOD_TO_ORDER';
  // User remove payment method from order
  static ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER = 'ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER';
  static ACTION_CHANGE_AMOUNT_PAYMENT            = 'ACTION_CHANGE_AMOUNT_PAYMENT';
  
  // when data payment change, need recollect totals
  static ACTION_UPDATE_CHECKOUT_PAYMENT_DATA = 'ACTION_UPDATE_CHECKOUT_PAYMENT_DATA';
  
  constructor(private store$: Store<any>) { }
  
  back() {
    this.store$.dispatch({type: PosStepActions.ACTION_BACK_CHECKOUT_PAGE})
  }
  
  userSelectPaymentMethod(payment: PaymentMethod) {
    this.store$.dispatch({type: PosStepActions.ACTION_USER_SELECT_PAYMENT_METHOD, payload: {payment}});
  }
  
  removePaymentMethodFromOrder(payment: PaymentMethod) {
    this.store$.dispatch({type: PosStepActions.ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER, payload: {payment}});
  }
  
  changeAmountPayment(payment: PaymentMethod, amount: number) {
    this.store$.dispatch({type: PosStepActions.ACTION_CHANGE_AMOUNT_PAYMENT, payload: {payment, amount}});
  }
}
