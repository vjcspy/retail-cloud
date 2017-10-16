import {Action, ActionReducer} from "@ngrx/store";
import {CheckoutStep, Payment3rd, PaymentMethod, posStepStateFactory, PosStepStateRecord} from "./step.state";
import {PosStepActions} from "./step.actions";
import {List} from "immutable";
import {mergeSliceReducers} from "../../../../../../../R/index";
import {tyroReducer} from "./payment/tyro.reducer";
import {orderListAddPaymentReducer} from "./order-list-add-payment/add-payment.reducer";
import {QuoteRefundActions} from "../../../../../R/quote/refund/refund.actions";
import {routerActions} from "@ngrx/router-store";

const posStepMainReducer: ActionReducer<PosStepStateRecord> = (state: PosStepStateRecord, action: Action) => {
  switch (action.type) {
    case routerActions.UPDATE_LOCATION:
    case PosStepActions.ACTION_BACK_CHECKOUT_PAGE:
    case PosStepActions.ACTION_STEP_NEW_ORDER:
      return removeDataStep(state);
    
    case PosStepActions.ACTION_GET_PAYMENT_METHOD_CAN_USE:
      return state.set('paymentMethodCanUse', action.payload['paymentMethodCanUse'])
                  .set('cashPaymentId', action.payload['cashPaymentId']);
    
    case PosStepActions.ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER:
      return state.update('paymentMethodUsed', (p) => p.filter((_p) => _p['created_at'] !== action.payload['payment']['created_at']))
                  .update('listPayment3rdData', (p: List<Payment3rd>) => p.filter((_p: Payment3rd) => _p.type !== action.payload['payment']['type']));
    
    case PosStepActions.ACTION_UPDATE_CHECKOUT_PAYMENT_DATA:
      if (action.payload.hasOwnProperty('moneySuggestion')) {
        state = state.set('moneySuggestion', action.payload['moneySuggestion']);
      }
      return state.set('checkoutStep', CheckoutStep.PAYMENT)
                  .update('totals', (t) => Object.assign({}, {...t}, {...action.payload['totals']}));
    
    case PosStepActions.ACTION_ADD_PAYMENT_METHOD_TO_ORDER:
      return state.update('paymentMethodUsed', (l) => l.map((_p) => {
        return Object.assign({}, {..._p}, {isChanging: false});
      }).push(action.payload['payment']));
    
    case PosStepActions.ACTION_CHANGE_AMOUNT_PAYMENT:
      return state.update('paymentMethodUsed', (l) => l.map((p) => {
        if (p.created_at === action.payload['payment']['created_at']) {
          p        = Object.assign({}, {...p});
          p.amount = action.payload['amount'];
        }
        
        return p;
      }));
    
    case PosStepActions.ACTION_START_SAVE_ORDER:
      return state.set('isSavingOrder', true);
    
    case PosStepActions.ACTION_CHECK_BEFORE_SAVE_ORDER:
      return state.set('isChecking3rd', action.payload['isChecking3rd']);
    
    case PosStepActions.ACTION_RESOLVE_ALL_PAYMENT_3RD:
      return state.set('isChecking3rd', false);
    
    case PosStepActions.ACTION_PAYMENT_3RD_PAY_SUCCESS:
    case PosStepActions.ACTION_PAYMENT_3RD_UPDATE_INFO:
      return state.update('listPayment3rdData', (l: List<Payment3rd>) => l.map((_p) => {
        if (_p.type === action.payload['type']) {
          // fix addition data missing
          let additionData = Object.assign({}, {..._p['additionData']}, {...action.payload['additionData']});
          
          _p = Object.assign({}, {..._p}, action.payload, {additionData});
          
          if (action.type === PosStepActions.ACTION_PAYMENT_3RD_PAY_SUCCESS) {
            _p.isPaySuccess = true;
          }
        }
        return _p;
      })).update('paymentMethodUsed', (_l: List<PaymentMethod>) => _l.map((_p) => {
        if (_p.type === action.payload['type']) {
          // fix addition data missing
          let additionData = Object.assign({}, {..._p['data']}, {...action.payload['additionData']});
          
          return Object.assign({}, {..._p}, {data: additionData});
        } else {
          return _p;
        }
      }));
    
    case QuoteRefundActions.ACTION_LOAD_CREDITMEMO_FAILED:
    case PosStepActions.ACTION_SAVE_ORDER_FAILED:
    case PosStepActions.ACTION_PAYMENT_3RD_PAY_FAIL:
      return state.set('isChecking3rd', false)
                  .set('isSavingOrder', false);
    
    case PosStepActions.ACTION_SAVED_ORDER:
      return state.set('checkoutStep', CheckoutStep.COMPLETE)
                  .set('isSavingOrder', false)
                  .set('orderOffline', action.payload['orderOffline']);
    
    case QuoteRefundActions.ACTION_SAVE_CREDITMEMO_SUCCESS:
      return state.set('orderRefund', action.payload['orderRefunded']);
    
    default:
      return state;
  }
};

export const posStepReducer: ActionReducer<PosStepStateRecord> = mergeSliceReducers(posStepStateFactory(), posStepMainReducer, tyroReducer, orderListAddPaymentReducer);

export function removeDataStep(state: PosStepStateRecord) {
  return state.delete('checkoutStep')
              .delete('totals')
              .delete('paymentMethodUsed')
              .delete('moneySuggestion')
              .delete('isSavingOrder')
              .delete('orderRefund')
              .delete('orderOffline')
              .delete('listPayment3rdData')
              .delete('isChecking3rd');
}
