import {Action, ActionReducer} from "@ngrx/store";
import {CheckoutStep, Payment3rd, posStepStateFactory, PosStepStateRecord} from "./step.state";
import {PosStepActions} from "./step.actions";
import {PosSyncActions} from "../../../../../R/sync/sync.actions";
import {List} from "immutable";

export const posStepReducer: ActionReducer<PosStepStateRecord> = (state: PosStepStateRecord = posStepStateFactory(), action: Action) => {
  switch (action.type) {
    case PosSyncActions.ACTION_SYNC_ORDER_SUCCESS:
    case PosStepActions.ACTION_STEP_NEW_ORDER:
    case PosStepActions.ACTION_BACK_CHECKOUT_PAGE:
      if (action.type === PosStepActions.ACTION_BACK_CHECKOUT_PAGE) {
        state = state.delete('paymentMethodUsed');
      }
      return state.delete('checkoutStep')
                  .delete('totals')
                  .delete('canSaveOrder')
                  .delete('isSavingOrder')
                  .delete('moneySuggestion')
                  .delete('listPayment3rdData')
                  .delete('isChecking3rd');
    
    case PosStepActions.ACTION_GET_PAYMENT_METHOD_CAN_USE:
      return state.set('paymentMethodCanUse', action.payload['paymentMethodCanUse']);
    
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
        _p.isChanging = false;
        return _p;
      }).push(action.payload['payment']));
    
    case PosStepActions.ACTION_CHANGE_AMOUNT_PAYMENT:
      return state.update('paymentMethodUsed', (l) => l.map((p) => {
        if (p.created_at === action.payload['payment']['created_at']) {
          p.amount = action.payload['amount'];
        }
        
        return p;
      }));
    
    case PosStepActions.ACTION_START_SAVE_ORDER:
      return state.set('isSavingOrder', true);
    
    case PosStepActions.ACTION_CHECK_BEFORE_SAVE_ORDER:
      return state.set('isChecking3rd', action.payload['isChecking3rd']);
    
    case PosStepActions.ACTION_ADD_PAYMENT_3RD:
      return state.update('listPayment3rdData', (l) => l.push(action.payload['payment3rdData']));
    
    case PosStepActions.ACTION_RESOLVE_ALL_PAYMENT_3RD:
      return state.set('isChecking3rd', false);
    
    case PosStepActions.ACTION_PAYMENT_3RD_PAY_SUCCESS:
    case PosStepActions.ACTION_PAYMENT_3RD_UPDATE_INFO:
      return state.update('listPayment3rdData', (l: List<Payment3rd>) => l.map((_p) => {
        if (_p.type === action.payload['type']) {
          _p = Object.assign({}, {..._p}, action.payload);
          
          if (action.type === PosStepActions.ACTION_PAYMENT_3RD_PAY_SUCCESS) {
            _p.isPaySuccess = true;
          }
        }
        return _p;
      }));
    
    case PosStepActions.ACTION_SAVE_ORDER_FAILED:
    case PosStepActions.ACTION_PAYMENT_3RD_PAY_FAIL:
      return state.set('isChecking3rd', false)
                  .set('isSavingOrder', false);
    
    case PosStepActions.ACTION_SAVED_ORDER:
      return state.set('checkoutStep', CheckoutStep.COMPLETE)
                  .set('orderOffline', action.payload['orderOffline']);
    
    default:
      return state;
  }
};
