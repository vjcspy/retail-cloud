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
    const action = {type: AccountActions.ACTION_LOGIN_FAILED, payload: {}};
    
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
  
  static SAVE_LICENSE_DATA = 'SAVE_LICENSE_DATA';
  
  saveLicenseData(license, dispatch: boolean = true): Action {
    const action = {type: AccountActions.SAVE_LICENSE_DATA, payload: {license}};
    
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
}
