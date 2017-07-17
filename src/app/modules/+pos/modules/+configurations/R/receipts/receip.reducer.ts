import {ActionReducer} from "@ngrx/store";
import {ConfigurationsReceiptActions} from "./receipt.actions";
import {ConfigurationsReceiptStateRecord, makeConfigurationsReceiptStateFactory} from "./receipt.state";

export const configurationsReceiptReducer: ActionReducer<ConfigurationsReceiptStateRecord> = (state = makeConfigurationsReceiptStateFactory(), action) => {
  const type = action.type;
  
  if (type === ConfigurationsReceiptActions.ACTION_SELECT_RECEIPT) {
    return state.set('receipt', action.payload['receipt']);
  }
  
  if (type === ConfigurationsReceiptActions.ACTION_LOADED_DEPENDENCY) {
    return state.set('isLoadedDependency', action.payload['isLoadedDependency']);
  }
  
  return state;
};
