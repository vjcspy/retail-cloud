import {ActionReducer} from "@ngrx/store";
import {accountStateFactory, AccountStateRecord} from "./account.state";
import {AccountActions} from "./account.actions";

export const accountReducer: ActionReducer<AccountStateRecord> = (state = accountStateFactory(), action) => {
  switch (action.type) {
    case AccountActions.ACTION_LOGIN:
    case AccountActions.ACTION_USER_REGISTER:
    case AccountActions.ACTION_LOGOUT:
    case AccountActions.ACTION_USER_SEND_RESET_PASSWORD:
    case AccountActions.ACTION_USER_RESET_PASSWORD:
    case AccountActions.ACTION_SAVE_USER_PROFILE:
      return state.set('isProcessing', true);
    
    case AccountActions.ACTION_LOGIN_SUCCESS:
    case AccountActions.ACTION_LOGIN_FAILED:
    case AccountActions.ACTION_USER_REGISTER_FAILED:
    case AccountActions.ACTiON_USER_REGISTER_SUCCESS:
    case AccountActions.ACTION_GO_LOGIN_PAGE:
    case AccountActions.ACTION_SAVE_USER_PROFILE_FAIL:
    case AccountActions.ACTION_USER_SEND_RESET_PASSWORD_FAILED:
    case AccountActions.ACTION_SAVE_USER_PROFILE_SUCCESS:
      return state.set('isProcessing', false);
    
    case AccountActions.ACTION_SAVE_ACCOUNT:
      return state.set('user', action.payload['user']);
    
    default:
      return state;
  }
};
