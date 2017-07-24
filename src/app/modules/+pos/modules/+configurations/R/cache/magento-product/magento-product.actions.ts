import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class MagentoProductActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_PULLED_CACHE_INSTANCE = 'ACTION_PULLED_CACHE_INSTANCE';
  
  pulledCacheInstance(instances, dispatch: boolean = true): Action {
    const action = {type: MagentoProductActions.ACTION_PULLED_CACHE_INSTANCE, payload: {instances}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_DELETE_INSTANCE = 'ACTION_DELETE_INSTANCE';
  
  deleteInstance(id, dispatch: boolean = true): Action {
    const action = {type: MagentoProductActions.ACTION_DELETE_INSTANCE, payload: {id}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_DELETE_INSTANCE_SUCCESS = 'ACTION_DELETE_INSTANCE_SUCCESS';
  
  deleteInstanceSuccess(id, dispatch: boolean = true): Action {
    const action = {type: MagentoProductActions.ACTION_DELETE_INSTANCE_SUCCESS, payload: {id}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_DELETE_INSTANCE_FAILED = 'ACTION_DELETE_INSTANCE_FAILED';
  
  deleteInstanceFailed(mess, e, dispatch: boolean = true): Action {
    const action = {type: MagentoProductActions.ACTION_DELETE_INSTANCE_FAILED, payload: {mess, e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
