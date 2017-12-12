import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions} from "@ngrx/effects";

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
  
  static ACTION_SAVE_USER_PROFILE = 'ACTION_SAVE_USER_PROFILE';
  
  saveUserProfile(user, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_SAVE_USER_PROFILE, payload: {user}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_USER_PROFILE_SUCCESS = 'ACTION_SAVE_USER_PROFILE_SUCCESS';
  
  saveUserProfileSuccess(dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_SAVE_USER_PROFILE_SUCCESS, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_USER_PROFILE_FAIL = 'ACTION_SAVE_USER_PROFILE_FAIL';
  
  saveUserProfileFail(mess, e, dispatch: boolean = true): Action {
    const action = {type: AccountActions.ACTION_SAVE_USER_PROFILE_FAIL, payload: {mess, e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
