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
    const action = {type: ShopManageActions.ACTION_SAVE_ROLE_FAIL, payload: {mess,e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
