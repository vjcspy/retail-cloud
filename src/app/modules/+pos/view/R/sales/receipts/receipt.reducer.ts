import {Action, ActionReducer} from "@ngrx/store";
import {receiptStateFactory, ReceiptStateRecord} from "./receipt.state";
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
                           .set('customerEmail', action.payload['customerEmail'])
                           .set('typePrint', 'email');
      });
    
    default:
      return state;
  }
};
