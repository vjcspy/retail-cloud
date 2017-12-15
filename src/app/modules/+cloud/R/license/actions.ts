import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class LicenseActions {
  
  constructor(protected store$: Store<any>) {}
  
  static ACTION_SAVE_LICENSE_BY_ADMIN = 'ACTION_SAVE_LICENSE_BY_ADMIN';
  
  saveLicense(license, licenseHasProducts, user, dispatch: boolean = true): Action {
    const action = {type: LicenseActions.ACTION_SAVE_LICENSE_BY_ADMIN, payload: {license, licenseHasProducts, user}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_LICENSE_BY_ADMIN_SUCCESS = 'ACTION_SAVE_LICENSE_BY_ADMIN_SUCCESS';
  
  saveLicenseSuccess(dispatch: boolean = true): Action {
    const action = {type: LicenseActions.ACTION_SAVE_LICENSE_BY_ADMIN_SUCCESS, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_LICENSE_BY_ADMIN_FAIL = 'ACTION_SAVE_LICENSE_BY_ADMIN_FAIL';
  
  saveLicenseFail(mess, e, dispatch: boolean = true): Action {
    const action = {type: LicenseActions.ACTION_SAVE_LICENSE_BY_ADMIN_FAIL, payload: {mess, e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
