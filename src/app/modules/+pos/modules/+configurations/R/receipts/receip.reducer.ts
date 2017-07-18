import {ActionReducer} from "@ngrx/store";
import {ConfigurationsReceiptActions} from "./receipt.actions";
import {ConfigurationsReceiptStateRecord, makeConfigurationsReceiptStateFactory} from "./receipt.state";

export const configurationsReceiptReducer: ActionReducer<ConfigurationsReceiptStateRecord> = (state = makeConfigurationsReceiptStateFactory(), action) => {
  const type = action.type;
  
  if (type === ConfigurationsReceiptActions.ACTION_SELECT_RECEIPT) {
    return state.set('receipt', Object.assign({}, action.payload['receipt']));
  }
  if (type === ConfigurationsReceiptActions.ACTION_SAVE_RECEIPT_SUCCESS) {
    return state.set('receipt', Object.assign({}, action.payload['receipt']))
                .set('isSaving', false);
  }
  
  if (type === ConfigurationsReceiptActions.ACTION_SAVE_RECEIPT_FAIL) {
    return state
      .set('isSaving', false);
  }
  
  if (type === ConfigurationsReceiptActions.ACTION_SAVE_RECEIPT) {
    return state
      .set('isSaving', true);
  }
  
  if (type === ConfigurationsReceiptActions.ACTION_LOADED_DEPENDENCY) {
    return state.set('isLoadedDependency', action.payload['isLoadedDependency']);
  }
  
  return state;
};
