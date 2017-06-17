import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Payment3rd, PaymentMethod} from "./step.state";

@Injectable()
export class PosStepActions {
  
  constructor(private store$: Store<any>) { }
  
  /**
   ** @REDUCER:
   *
   * Save payment methodCanUse when pulled payment
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_GET_PAYMENT_METHOD_CAN_USE = 'ACTION_GET_PAYMENT_METHOD_CAN_USE';
  
  savePaymentMethodCanUseFromDB(paymentMethodCanUse, cashPaymentId, dispatch: boolean = true): Action {
    const action = {type: PosStepActions.ACTION_GET_PAYMENT_METHOD_CAN_USE, payload: {paymentMethodCanUse, cashPaymentId}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Remove data of checkout step
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_BACK_CHECKOUT_PAGE = 'ACTION_BACK_CHECKOUT_PAGE';
  
  back() {
    this.store$.dispatch({type: PosStepActions.ACTION_BACK_CHECKOUT_PAGE})
  }
  
  /**
   ** @REDUCER:
   *
   *
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Check payment method when user select
   */
  static ACTION_USER_SELECT_PAYMENT_METHOD = 'ACTION_USER_SELECT_PAYMENT_METHOD';
  
  userSelectPaymentMethod(payment: PaymentMethod) {
    this.store$.dispatch({type: PosStepActions.ACTION_USER_SELECT_PAYMENT_METHOD, payload: {payment}});
  }
  
  /**
   ** @REDUCER:
   *
   * Push payment to list
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Recalculate totals data
   * Init tyro config
   */
  static ACTION_ADD_PAYMENT_METHOD_TO_ORDER = 'ACTION_ADD_PAYMENT_METHOD_TO_ORDER';
  
  addPaymentMethodToOrder(payment, dispatch: boolean = true): Action {
    const action = {type: PosStepActions.ACTION_ADD_PAYMENT_METHOD_TO_ORDER, payload: {payment}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save totals, moneySuggestion
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_UPDATE_CHECKOUT_PAYMENT_DATA = 'ACTION_UPDATE_CHECKOUT_PAYMENT_DATA';
  
  updatedCheckoutPaymentData(totals, moneySuggestion, dispatch: boolean = true): Action {
    const action = {type: PosStepActions.ACTION_UPDATE_CHECKOUT_PAYMENT_DATA, payload: {totals, moneySuggestion}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Remove payment from list
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER = 'ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER';
  
  removePaymentMethodFromOrder(payment: PaymentMethod) {
    this.store$.dispatch({type: PosStepActions.ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER, payload: {payment}});
  }
  
  /**
   ** @REDUCER:
   *
   * Save payment amount
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Recalculate totals data
   */
  static ACTION_CHANGE_AMOUNT_PAYMENT = 'ACTION_CHANGE_AMOUNT_PAYMENT';
  
  changeAmountPayment(payment: PaymentMethod, amount: number) {
    this.store$.dispatch({type: PosStepActions.ACTION_CHANGE_AMOUNT_PAYMENT, payload: {payment, amount}});
  }
  
  /**
   ** @REDUCER:
   *
   * Change state to know system saving order
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Run check is integrate with 3rd payment gateway
   */
  static ACTION_START_SAVE_ORDER = 'ACTION_START_SAVE_ORDER';
  
  userSaveOrder() {
    this.store$.dispatch({type: PosStepActions.ACTION_START_SAVE_ORDER});
  }
  
  /**
   ** @REDUCER:
   *
   * Save state to know is integrate 3rd payment gateway
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * If existed 3rd payment will trigger ACTION_PROCESS_PAYMENT_3RD
   * If not existed 3rd payment will trigger ACTION_RESOLVE_ALL_PAYMENT_3RD
   */
  static ACTION_CHECK_BEFORE_SAVE_ORDER = 'ACTION_CHECK_BEFORE_SAVE_ORDER';
  
  saveDataCheckingBeforeSaveOrder(isChecking3rd, dispatch: boolean = true): Action {
    const action = {type: PosStepActions.ACTION_CHECK_BEFORE_SAVE_ORDER, payload: {isChecking3rd}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   *
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Pay each 3rd payment data
   */
  static ACTION_PROCESS_PAYMENT_3RD = 'ACTION_PROCESS_PAYMENT_3RD';
  
  process3rdPayment(payment3rdData, dispatch: boolean = true): Action {
    const action = {type: PosStepActions.ACTION_PROCESS_PAYMENT_3RD, payload: {payment3rdData}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_PAYMENT_3RD_UPDATE_INFO = 'ACTION_PAYMENT_3RD_UPDATE_INFO';
  static ACTION_PAYMENT_3RD_PAY_SUCCESS = 'ACTION_PAYMENT_3RD_PAY_SUCCESS';
  static ACTION_PAYMENT_3RD_PAY_FAIL    = 'ACTION_PAYMENT_3RD_PAY_FAIL';
  
  /**
   ** @REDUCER:
   *
   * Change state to know all 3rd payment has been resolved
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Trigger save order
   */
  static ACTION_RESOLVE_ALL_PAYMENT_3RD = 'ACTION_RESOLVE_ALL_PAYMENT_3RD';
  
  resolvedAll3rdPayment(dispatch: boolean = true): Action {
    const action = {type: PosStepActions.ACTION_RESOLVE_ALL_PAYMENT_3RD};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save orderOffline
   * Change state saving order
   * Move next step
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Trigger auto print receipt
   */
  static ACTION_SAVED_ORDER = 'ACTION_SAVED_ORDER';
  
  savedOrder(orderOffline, saveOffline, dispatch: boolean = true): Action {
    const action = {type: PosStepActions.ACTION_SAVED_ORDER, payload: {orderOffline, saveOffline}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Change state saving
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_SAVE_ORDER_FAILED = 'ACTION_SAVE_ORDER_FAILED';
  
  saveOrderFailed(e, isSaveOnline, dispatch: boolean = true): Action {
    const action = {type: PosStepActions.ACTION_SAVE_ORDER_FAILED, payload: {e, isSaveOnline}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Clear step payment data
   * Clear quote data
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_STEP_NEW_ORDER = 'ACTION_STEP_NEW_ORDER';
  
  newOrder() {
    this.store$.dispatch({type: PosStepActions.ACTION_STEP_NEW_ORDER});
  }
}
