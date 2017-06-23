import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class AccountActions {
  constructor(private store$: Store<any>) { }
  
  static ACTION_LOGIN = 'ACTION_LOGIN';
  
  login(user, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_LOGIN, payload: {user}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_LOGIN_FAILED = 'ACTION_LOGIN_FAILED';
  
  loginFailed(dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_LOGIN_FAILED, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_LOGIN_SUCCESS = 'ACTION_LOGIN_SUCCESS';
  
  loginSuccess(user, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_LOGIN_SUCCESS, payload: {user}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
