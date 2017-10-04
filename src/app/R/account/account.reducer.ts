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
      return state.set('isProcessing', true);
    
    case AccountActions.ACTION_LOGIN_SUCCESS:
    case AccountActions.ACTION_LOGIN_FAILED:
    case AccountActions.ACTION_USER_REGISTER_FAILED:
    case AccountActions.ACTiON_USER_REGISTER_SUCCESS:
      return state.set('isProcessing', false);
    
    case AccountActions.ACTION_GO_LOGIN_PAGE:
      state = state.set('isProcessing', false);
      return state;
    
    case AccountActions.ACTION_SAVE_ACCOUNT:
      return state.set('user', action.payload['user']);
    
    default:
      return state;
  }
};
