import {Action, ActionReducer} from "@ngrx/store";
import {retailConfigStateFactory, RetailConfigStateRecord} from "./retail-config.state";
import {RetailConfigActions} from "./retail-config.actions";

export const retailConfigReducer: ActionReducer<RetailConfigStateRecord> = (state = retailConfigStateFactory(), action: Action) => {
  switch (action.type) {
    case RetailConfigActions.ACTION_SAVE_RETAIL_CONFIG:
      return state.set('isSaving', true);
    
    case RetailConfigActions.ACTION_SAVE_RETAIL_CONFIG_SUCCESS:
      return state.set('isSaving', false);
    
    case RetailConfigActions.ACTION_SAVE_RETAIL_CONFIG_FAILED:
      return state.set('isSaving', false);
    
    default:
      return state;
  }
};
