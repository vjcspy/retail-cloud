import {ActionReducer} from "@ngrx/store";
import {accountStateFactory, AccountStateRecord} from "./account.state";
import {AccountActions} from "./account.actions";
import {List} from "immutable";

export const accountReducer: ActionReducer<AccountStateRecord> = (state = accountStateFactory(), action) => {
  switch (action.type) {
    case AccountActions.ACTION_LOGIN:
    case AccountActions.ACTION_LOGOUT:
      return state.set('isLogging', true)
                  .set('license', {
                    licenseHasPos: null,
                  })
                  .set('user', {
                    id: null,
                    username: null,
                    emails: List.of()
                  });
    
    case AccountActions.ACTION_LOGIN_SUCCESS:
    case AccountActions.ACTION_LOGIN_FAILED:
      return state.set('isLogging',false);
    
    case AccountActions.ACTION_GO_LOGIN_PAGE:
      state = state.set('isLogging', false);
      if (action.payload['redirect']) {
        state = state.set('redirect', action.payload['redirect']);
      }
      return state;
    
    // case AccountActions.SAVE_LICENSE_DATA:
    //   return state.set('license', {licenseHasPos: action.payload['license']['licenseHasPos']});
    
    default:
      return state;
  }
};
