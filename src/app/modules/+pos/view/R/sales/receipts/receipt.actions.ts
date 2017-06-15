import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class ReceiptActions {
  static ACTION_PRINT_SALE_RECEIPT = 'ACTION_PRINT_SALE_RECEIPT';
  static ACTION_SEND_RECEIPT_EMAIL = 'ACTION_SEND_RECEIPT_EMAIL';
  
  constructor(private store$: Store<any>) { }
  
  printSalesReceipt(order: any, typePrint, customerReceipt: any = null, merchantReceipt: any = null) {
    this.store$.dispatch({type: ReceiptActions.ACTION_PRINT_SALE_RECEIPT, payload: {order, typePrint, customerReceipt, merchantReceipt}})
  }
  
  sendEmailReceipt(order: any, customerEmail: string) {
    this.store$.dispatch({type: ReceiptActions.ACTION_SEND_RECEIPT_EMAIL, payload: {order, customerEmail}});
  }
}
