import {Action, ActionReducer} from "@ngrx/store";
import {receiptStateFactory, ReceiptStateRecord} from "./receipt.state";
import {ReceiptActions} from "./receipt.actions";

export const receiptReducer: ActionReducer<ReceiptStateRecord> = (state: ReceiptStateRecord = receiptStateFactory(), action: Action) => {
  switch (action.type) {
    
    case ReceiptActions.ACTION_PRINT_SALE_RECEIPT:
      return state.update('salesReceipt', (salesReceipt) => {
        salesReceipt.set('order', action.payload['order'])
                    .set('typePrint', action.payload['typePrint']);
        
        if (action.payload.hasOwnProperty('customerReceipt')) {
          salesReceipt.set('customerReceipt', action.payload['customerReceipt']);
        }
        if (action.payload.hasOwnProperty('merchantReceipt')) {
          salesReceipt.set('merchantReceipt', action.payload['merchantReceipt']);
        }
        return salesReceipt;
      });
    
    default:
      return state;
  }
};
