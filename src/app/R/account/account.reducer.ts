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
                    emails: List.of(),
                    baseUrl : null
                  })
                  .set('isAutoLogin', false);
    
    case AccountActions.ACTION_LOGIN_SUCCESS:
      state = state.set('isLogging', false)
               .set('isAutoLogin', false);
      if(action.payload['user']){
        state = state.set('user', action.payload['user']);
      }
      return state;
    
    case AccountActions.ACTION_LOGIN_FAILED:
      return state.set('isLogging',false).set('isAutoLogin', false);
    
    case AccountActions.ACTION_GO_LOGIN_PAGE:
      state = state.set('isLogging', false).set('isAutoLogin', false);
      if (action.payload['redirect']) {
        state = state.set('redirect', action.payload['redirect']);
      }
      return state;
    
    case AccountActions.AUTO_LOGOUT:
      return state.set('isAutoLogin',true);
    // case AccountActions.SAVE_LICENSE_DATA:
    //   return state.set('license', {licenseHasPos: action.payload['license']['licenseHasPos']});
    
    default:
      return state;
  }
};
