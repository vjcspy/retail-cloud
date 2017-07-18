import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ConfigurationsReceiptActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_SELECT_RECEIPT = 'ACTION_SELECT_RECEIPT';
  
  selectReceipt(receipt, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsReceiptActions.ACTION_SELECT_RECEIPT, payload: {receipt}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_LOADED_DEPENDENCY = 'ACTION_LOADED_DEPENDENCY';
  
  loadedDependency(isLoadedDependency: boolean, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsReceiptActions.ACTION_LOADED_DEPENDENCY, payload: {isLoadedDependency}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_RECEIPT = 'ACTION_SAVE_RECEIPT';
  
  saveReceipt(receipt, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsReceiptActions.ACTION_SAVE_RECEIPT, payload: {receipt}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_RECEIPT_SUCCESS = 'ACTION_SAVE_RECEIPT_SUCCESS';
  
  saveReceiptSuccess(receipt, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsReceiptActions.ACTION_SAVE_RECEIPT_SUCCESS, payload: {receipt}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_RECEIPT_FAIL = 'ACTION_SAVE_RECEIPT_FAIL';
  
  saveReceiptFail(mess, e, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsReceiptActions.ACTION_SAVE_RECEIPT_FAIL, payload: {mess, e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_REMOVED_LICENSE_EDITOR = 'ACTION_REMOVED_LICENSE_EDITOR';
  
  removedLicenseEditor(dispatch: boolean = true): Action {
    const action = {type: ConfigurationsReceiptActions.ACTION_REMOVED_LICENSE_EDITOR, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
