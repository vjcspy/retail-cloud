import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

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
  
  static AUTO_LOGOUT = 'AUTO_LOGOUT';
  
  autoLogout(dispatch: boolean = true): Action {
    const action = {type: AccountActions.AUTO_LOGOUT, payload: {}};
  
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
}
