import {ActionReducer} from "@ngrx/store";
import {accountStateFactory, AccountStateRecord} from "./account.state";
import {AccountActions} from "./account.actions";

export const accountReducer: ActionReducer<AccountStateRecord> = (state = accountStateFactory(), action) => {
  switch (action.type) {
    case AccountActions.ACTION_LOGIN:
    case AccountActions.ACTION_LOGOUT:
      return state.set('isLogging', true);
    
    case AccountActions.ACTION_LOGIN_SUCCESS:
    case AccountActions.ACTION_LOGIN_FAILED:
      return state.set('isLogging', false);
    
    case AccountActions.ACTION_GO_LOGIN_PAGE:
      state = state.set('isLogging', false);
      if (action.payload['redirect']) {
        state = state.set('redirect', action.payload['redirect']);
      }
      return state;
    
    default:
      return state;
  }
};
