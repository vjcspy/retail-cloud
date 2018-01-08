import {ActionReducer} from "@ngrx/store";
import {accountStateFactory, AccountStateRecord} from "./account.state";
import {AccountActions} from "./account.actions";

export const accountReducer: ActionReducer<AccountStateRecord> = (state = accountStateFactory(), action) => {
  switch (action.type) {
    case AccountActions.ACTION_LOGIN:
    case AccountActions.ACTION_USER_REGISTER:
    case AccountActions.ACTION_USER_SEND_RESET_PASSWORD:
    case AccountActions.ACTION_USER_RESET_PASSWORD:
      return state.set('isProcessing', true);
    
    case AccountActions.ACTION_LOGIN_SUCCESS:
    case AccountActions.ACTION_LOGIN_FAILED:
    case AccountActions.ACTION_USER_REGISTER_FAILED:
    case AccountActions.ACTiON_USER_REGISTER_SUCCESS:
    case AccountActions.ACTION_GO_LOGIN_PAGE:
      return state.set('isProcessing', false);
    
    case AccountActions.ACTION_SAVE_ACCOUNT:
      return state.set('user', action.payload['user']);
    
    case AccountActions.SAVE_LICENSE_DATA:
      return state.set('license', action.payload['license']);
  
    case AccountActions.ACTION_RESOLVED_URLS:
      return state.set('urls', action.payload['urls']);
      
    case AccountActions.ACTION_CHANGE_URL:
      return state.set('default_url', action.payload['default_url']);
    case AccountActions.ACTION_LOGOUT:
      return accountStateFactory();
    default:
      return state;
  }
};
