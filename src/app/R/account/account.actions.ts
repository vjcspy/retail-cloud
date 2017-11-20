import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions} from "@ngrx/effects";

@Injectable()
export class AccountActions {
  constructor(private store$: Store<any>) { }
  
  static ACTION_LOGIN = 'ACTION_LOGIN';
  
  login(user,baseUrl, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_LOGIN, payload: {user,baseUrl}};
    
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
  
  static ACTION_LOGOUT = 'ACTION_LOGOUT';
  
  logout(dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_LOGOUT, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_LOGOUT_FAILED = 'ACTION_LOGOUT_FAILED';
  
  logoutFailed(dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_LOGOUT_FAILED, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_GO_LOGIN_PAGE = 'ACTION_GO_LOGIN_PAGE';
  
  goLoginPage(redirect, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_GO_LOGIN_PAGE, payload: {redirect}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  

  static ACTION_CHANGE_URL = 'ACTION_CHANGE_URL';
  
  changeUrl(url, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_CHANGE_URL, payload: {url}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    return action;
  }
}
