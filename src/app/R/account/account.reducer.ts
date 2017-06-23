import {ActionReducer} from "@ngrx/store";
import {accountStateFactory, AccountStateRecord} from "./account.state";
import {AccountActions} from "./account.actions";

export const accountReducer: ActionReducer<AccountStateRecord> = (state = accountStateFactory(), action) => {
  switch (action.type) {
    case AccountActions.ACTION_LOGIN:
      return state.set('isLogging', true);
    
    case AccountActions.ACTION_LOGIN_SUCCESS:
    case AccountActions.ACTION_LOGIN_FAILED:
      return state.set('isLogging', false);
    
    default:
      return state;
  }
};
