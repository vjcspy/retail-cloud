import {ActionReducer} from "@ngrx/store";
import {shopManageStateFactory, ShopManageStateRecord} from "./state";
import {ShopManageActions} from "./actions";

export const shopManageReducer: ActionReducer<ShopManageStateRecord> = (state = shopManageStateFactory(), action) => {
  switch (action.type) {
    case ShopManageActions.ACTION_SAVE_ROLE:
    case ShopManageActions.ACTION_DELETE_ROLE:
    case ShopManageActions.ACTION_SAVE_PERMISSION:
    case ShopManageActions.ACTION_SAVE_CASHIER:
      return state.set('isProcessing', true);
    
    case ShopManageActions.ACTION_SAVE_ROLE_SUCCESS:
    case ShopManageActions.ACTION_SAVE_ROLE_FAIL:
    case ShopManageActions.ACTION_DELETE_ROLE_FAIL:
    case ShopManageActions.ACTION_DELETE_ROLE_SUCCESS:
    case ShopManageActions.ACTION_SAVE_PERMISSION_SUCCESS:
    case ShopManageActions.ACTION_SAVE_PERMISSION_FAIL:
    case ShopManageActions.ACTION_SAVE_CASHIER_SUCCESS:
    case ShopManageActions.ACTION_SAVE_CASHIER_FAIL:
      return state.set('isProcessing', false);
    
    default:
      return state;
  }
};
