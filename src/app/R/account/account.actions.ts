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
  
  loginSuccess(dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_LOGIN_SUCCESS, payload: {}};
    
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
  
  static ACTION_USER_REGISTER = 'ACTION_REGISTER';
  
  register(user, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_USER_REGISTER, payload: {user}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_USER_REGISTER_FAILED = 'ACTION_USER_REGISTER_FAILED';
  
  registerFailed(err, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_USER_REGISTER_FAILED, payload: {err}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTiON_USER_REGISTER_SUCCESS = 'ACTiON_USER_REGISTER_SUCCESS';
  
  registerSuccess(user, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTiON_USER_REGISTER_SUCCESS, payload: {user}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_USER_SEND_RESET_PASSWORD = 'ACTION_USER_SEND_RESET_PASSWORD';
  
  sendResetPassword(user, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_USER_SEND_RESET_PASSWORD, payload: {user}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_USER_RESET_PASSWORD = 'ACTION_USER_RESET_PASSWORD';
  
  resetPasswrod(token: string, newPassword: string, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_USER_RESET_PASSWORD, payload: {token, newPassword}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_ACCOUNT = 'ACTION_SAVE_ACCOUNT';
  
  saveAccount(user, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_SAVE_ACCOUNT, payload: {user}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static SAVE_LICENSE_DATA = 'SAVE_LICENSE_DATA';
  
  saveLicenseData(license, dispatch: boolean = true): Action {
    const action = {type: AccountActions.SAVE_LICENSE_DATA, payload: {license}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_RESOLVED_URLS  =  'ACTION_RESOLVED_URLS';

  resolvedUrls(urls, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_RESOLVED_URLS, payload: {urls}};

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
