import {Action, ActionReducer} from "@ngrx/store";
import {CheckoutStep, posStepStateFactory, PosStepStateRecord} from "./step.state";
import {PosStepActions} from "./step.actions";
import {PosSyncActions} from "../../../../../R/sync/sync.actions";

export const posStepReducer: ActionReducer<PosStepStateRecord> = (state: PosStepStateRecord = posStepStateFactory(), action: Action) => {
  switch (action.type) {
    case PosSyncActions.ACTION_SYNC_ORDER_SUCCESS:
      return state.delete('checkoutStep')
                  .delete('paymentMethodUsed')
                  .delete('canSaveOrder')
                  .delete('moneySuggestion');
    
    case PosStepActions.ACTION_BACK_CHECKOUT_PAGE:
      return state.set('checkoutStep', CheckoutStep.NONE);
    
    case PosStepActions.ACTION_GET_PAYMENT_METHOD_CAN_USE:
      return state.set('paymentMethodCanUse', action.payload['paymentMethodCanUse']);
    
    case PosStepActions.ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER:
      return state.update('paymentMethodUsed', (p) => p.filter((_p) => _p['time'] !== action.payload['payment']['time']));
    
    case PosStepActions.ACTION_UPDATE_CHECKOUT_PAYMENT_DATA:
      return state.set('checkoutStep', CheckoutStep.PAYMENT)
                  .update('totals', (t) => Object.assign({}, {...t}, {...action.payload['totals']}));
    
    case PosStepActions.ACTION_ADD_PAYMENT_METHOD_TO_ORDER:
      return state.update('paymentMethodUsed', (l) => [...l, ...action.payload['payment']]);
    
    default:
      return state;
  }
};
