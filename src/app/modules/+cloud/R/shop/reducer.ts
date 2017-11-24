import {ActionReducer} from "@ngrx/store";
import {shopManageStateFactory, ShopManageStateRecord} from "./state";
import {ShopManageActions} from "./actions";

export const shopManageReducer: ActionReducer<ShopManageStateRecord> = (state = shopManageStateFactory(), action) => {
  switch (action.type) {
    case ShopManageActions.ACTION_SAVE_ROLE:
      return state.set('isProcessing', true);
    
    case ShopManageActions.ACTION_SAVE_ROLE_SUCCESS:
    case ShopManageActions.ACTION_SAVE_ROLE_FAIL:
      return state.set('isProcessing', false);
    
    default:
      return state;
  }
};
