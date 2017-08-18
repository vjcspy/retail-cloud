import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ReceiptActions {
  constructor(private store$: Store<any>) { }
  
  /**
   ** @REDUCER:
   *
   * Save receipt data and 3rd payment data(if have)
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Print receipt
   */
  static ACTION_PRINT_SALE_RECEIPT = 'ACTION_PRINT_SALE_RECEIPT';
  
  printSalesReceipt(orderOffline: any, typePrint = 'receipt', customerReceipt: any = null, merchantReceipt: any = null, dispatch: boolean = true): Action {
    const action = {
      type: ReceiptActions.ACTION_PRINT_SALE_RECEIPT,
      payload: {orderOffline, typePrint, customerReceipt, merchantReceipt}
    };
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save receipt data and customer email
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Send email
   */
  static ACTION_SEND_RECEIPT_EMAIL = 'ACTION_SEND_RECEIPT_EMAIL';
  
  sendEmailReceipt(orderOffline: any, customerEmail: string, customerName: string, receiptSetting: Object, username: string, inclDiscountPerItemInDiscount: boolean) {
    this.store$.dispatch({type: ReceiptActions.ACTION_SEND_RECEIPT_EMAIL, payload: {orderOffline, customerEmail, customerName, receiptSetting, username, inclDiscountPerItemInDiscount}});
  }
  
  /**
   ** @REDUCER:
   *
   * Save email receipt template
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Send email data to server
   */
  static ACTION_RESOLVED_RECEIPT_EMAIL = 'ACTION_RESOLVED_RECEIPT_EMAIL';
  
  resolvedEmailReceipt(template, dispatch: boolean = true): Action {
    const action = {type: ReceiptActions.ACTION_RESOLVED_RECEIPT_EMAIL, payload: {template}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Clear state
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_SENT_RECEIPT_EMAIL = 'ACTION_SENT_RECEIPT_EMAIL';
  
  sentReceiptEmail(dispatch: boolean = true): Action {
    const action = {type: ReceiptActions.ACTION_SENT_RECEIPT_EMAIL, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Clear state
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_SEND_RECEIPT_EMAIL_FAILED = 'ACTION_SEND_RECEIPT_EMAIL_FAILED';
  
  sendReceiptEmailFailed(e, dispatch: boolean = true): Action {
    const action = {type: ReceiptActions.ACTION_SEND_RECEIPT_EMAIL_FAILED, payload: {e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
