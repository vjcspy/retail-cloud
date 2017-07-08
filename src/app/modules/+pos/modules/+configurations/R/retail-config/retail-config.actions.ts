import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class RetailConfigActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_SAVE_RETAIL_CONFIG_SNAPSHOT = 'ACTION_SAVE_RETAIL_CONFIG_SNAPSHOT';
  
  saveRetailConfigSnapshot(retailConfig, dispatch: boolean = true): Action {
    const action = {type: RetailConfigActions.ACTION_SAVE_RETAIL_CONFIG_SNAPSHOT, payload: {retailConfig}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_RETAIL_CONFIG = 'ACTION_SAVE_RETAIL_CONFIG';
  
  saveRetailConfig(group, data, dispatch: boolean = true): Action {
    const action = {type: RetailConfigActions.ACTION_SAVE_RETAIL_CONFIG, payload: {group, data}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_RETAIL_CONFIG_SUCCESS = 'ACTION_SAVE_RETAIL_CONFIG_SUCCESS';
  
  saveRetailConfigSuccess(group, data, dispatch: boolean = true): Action {
    const action = {type: RetailConfigActions.ACTION_SAVE_RETAIL_CONFIG_SUCCESS, payload: {group, data}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_RETAIL_CONFIG_FAILED = 'ACTION_SAVE_RETAIL_CONFIG_FAILED';
  
  saveRetailConfigFailed(mess, dispatch: boolean = true): Action {
    const action = {type: RetailConfigActions.ACTION_SAVE_RETAIL_CONFIG_FAILED, payload: {mess}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
