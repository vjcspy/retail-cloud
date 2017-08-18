import {Action, ActionReducer} from "@ngrx/store";
import {receiptStateFactory, ReceiptStateRecord, SalesReceiptRecord} from "./receipt.state";
import {ReceiptActions} from "./receipt.actions";
import {PosStepActions} from "../checkout/step/step.actions";

export const receiptReducer: ActionReducer<ReceiptStateRecord> = (state: ReceiptStateRecord = receiptStateFactory(), action: Action) => {
  switch (action.type) {
    
    case PosStepActions.ACTION_SAVED_ORDER:
    case ReceiptActions.ACTION_PRINT_SALE_RECEIPT:
      return state.update('salesReceipt', (salesReceipt) => {
        salesReceipt = salesReceipt.set('orderOffline', action.payload['orderOffline'])
                                   .set('typePrint', !action.payload['typePrint'] ? 'receipt' : action.payload['typePrint']);
        
        if (action.payload.hasOwnProperty('customerReceipt')) {
          salesReceipt = salesReceipt.set('customerReceipt', action.payload['customerReceipt']);
        }
        if (action.payload.hasOwnProperty('merchantReceipt')) {
          salesReceipt = salesReceipt.set('merchantReceipt', action.payload['merchantReceipt']);
        }
        return salesReceipt;
      });
    
    case ReceiptActions.ACTION_SEND_RECEIPT_EMAIL:
      return state.update('salesReceipt', (salesReceipt) => {
        return salesReceipt.clear()
                           .set('orderOffline', action.payload['orderOffline'])
                           .set('typePrint', 'email')
                           .set('emailReceipt', {
                             email: action.payload['customerEmail'],
                             name: action.payload['customerName'],
                             isSending: true,
                             receiptSetting: action.payload['receiptSetting'],
                             username: action.payload['username'],
                             inclDiscountPerItemInDiscount: action.payload['inclDiscountPerItemInDiscount']
                           });
      });
    
    case ReceiptActions.ACTION_RESOLVED_RECEIPT_EMAIL:
      return state.update('salesReceipt', (salesReceipt: SalesReceiptRecord) => {
        return salesReceipt.set('emailReceipt', Object.assign({}, salesReceipt.emailReceipt, {template: action.payload['template']}));
      });
    
    case ReceiptActions.ACTION_SENT_RECEIPT_EMAIL:
    case ReceiptActions.ACTION_SEND_RECEIPT_EMAIL_FAILED:
      return state.clear();
    
    default:
      return state;
  }
};
