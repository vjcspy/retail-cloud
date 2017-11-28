import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ShopManageActions {
  constructor(protected store$: Store<any>) { }
  
  static ACTION_SAVE_ROLE = 'ACTION_SAVE_ROLE';
  
  saveRole(role, dispatch: boolean = true): Action {
    const action = {type: ShopManageActions.ACTION_SAVE_ROLE, payload: {role}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_ROLE_SUCCESS = 'ACTION_SAVE_ROLE_SUCCESS';
  
  saveRoleSuccess(dispatch: boolean = true): Action {
    const action = {type: ShopManageActions.ACTION_SAVE_ROLE_SUCCESS, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_ROLE_FAIL = 'ACTION_SAVE_ROLE_FAIL';
  
  saveRoleFail(mess, e, dispatch: boolean = true): Action {
    const action = {type: ShopManageActions.ACTION_SAVE_ROLE_FAIL, payload: {mess, e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_DELETE_ROLE = 'ACTION_DELETE_ROLE';
  
  deleteRole(role, dispatch: boolean = true): Action {
    const action = {type: ShopManageActions.ACTION_DELETE_ROLE, payload: {role}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_DELETE_ROLE_SUCCESS = 'ACTION_DELETE_ROLE_SUCCESS';
  
  deleteRoleSuccess(dispatch: boolean = true): Action {
    const action = {type: ShopManageActions.ACTION_DELETE_ROLE_SUCCESS, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_DELETE_ROLE_FAIL = 'ACTION_DELETE_ROLE_FAIL';
  
  deleteRoleFail(mess, e, dispatch: boolean = true): Action {
    const action = {type: ShopManageActions.ACTION_DELETE_ROLE_FAIL, payload: {mess, e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_PERMISSION = 'ACTION_SAVE_PERMISSION';
  
  savePermission(permissions, code, dispatch: boolean = true): Action {
    const action = {type: ShopManageActions.ACTION_SAVE_PERMISSION, payload: {permissions, code}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_PERMISSION_SUCCESS = 'ACTION_SAVE_PERMISSION_SUCCESS';
  
  savePermissionSuccess(dispatch: boolean = true): Action {
    const action = {type: ShopManageActions.ACTION_SAVE_PERMISSION_SUCCESS, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_PERMISSION_FAIL = 'ACTION_SAVE_PERMISSION_FAIL';
  
  savePermissionFail(mess, e, dispatch: boolean = true): Action {
    const action = {type: ShopManageActions.ACTION_SAVE_PERMISSION_FAIL, payload: {mess, e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_CASHIER = 'ACTION_SAVE_CASHIER';
  
  saveCashier(cashier, dispatch: boolean = true): Action {
    const action = {type: ShopManageActions.ACTION_SAVE_CASHIER, payload: {cashier}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_CASHIER_SUCCESS = 'ACTION_SAVE_CASHIER_SUCCESS';
  
  saveCashierSuccess(dispatch: boolean = true): Action {
    const action = {type: ShopManageActions.ACTION_SAVE_CASHIER_SUCCESS, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_CASHIER_FAIL = 'ACTION_SAVE_CASHIER_FAIL';
  
  saveCashierFail(mess, e, dispatch: boolean = true): Action {
    const action = {type: ShopManageActions.ACTION_SAVE_CASHIER_FAIL, payload: {mess, e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
