import {ActionReducer} from "@ngrx/store";
import {accountStateFactory, AccountStateRecord} from "./account.state";
import {AccountActions} from "./account.actions";
import {List} from "immutable";

export const accountReducer: ActionReducer<AccountStateRecord> = (state = accountStateFactory(), action) => {
  switch (action.type) {
    case AccountActions.ACTION_LOGIN:
    case AccountActions.ACTION_LOGOUT:
      return state.set('isProcessing', true);
                  // .set('license', {
                  //   licenseHasPos: null,
                  // })
                  // .set('user', {
                  //   id: null,
                  //   username: null,
                  //   emails: List.of(),
                  //   baseUrl: null,
                  //   role: null
                  // });
    
    case AccountActions.ACTION_LOGIN_SUCCESS:
      state = state.set('isProcessing', false);
      if(action.payload['user']){
        state = state.set('user', action.payload['user']);
      }
      return state;
      
    case AccountActions.ACTION_LOGIN_FAILED:
    case AccountActions.ACTION_GO_LOGIN_PAGE:
      return state.set('isProcessing', false);
    
    default:
      return state;
  }
};
