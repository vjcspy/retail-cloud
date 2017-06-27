import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {List} from "immutable";

@Injectable()
export class RealtimeActions {
  
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_REALTIME_NEED_REMOVE = 'ACTION_REALTIME_NEED_REMOVE';
  
  realtimeNeedRemove(realtimeData, dispatch: boolean = true): Action {
    const action = {type: RealtimeActions.ACTION_REALTIME_NEED_REMOVE, payload: {realtimeData}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_REALTIME_REMOVED_ENTITY_DB = 'ACTION_REALTIME_REMOVED_ENTITY_DB';
  
  realtimeRemovedEntityDB(entityCode: string, needRemove: List<string>, dispatch: boolean = true): Action {
    const action = {type: RealtimeActions.ACTION_REALTIME_REMOVED_ENTITY_DB, payload: {entityCode, needRemove}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_REALTIME_NEED_UPDATE = 'ACTION_REALTIME_NEED_UPDATE';
  
  realtimeNeedUpdate(realtimeData, dispatch: boolean = true): Action {
    const action = {type: RealtimeActions.ACTION_REALTIME_NEED_UPDATE, payload: {realtimeData}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_REALTIME_UPDATED_ENTITY_DB = 'ACTION_REALTIME_UPDATED_ENTITY_DB';
  
  realtimeUpdatedEntityDB(entityCode: string, needUpdate: List<string>, itemsData: any, dispatch: boolean = true): Action {
    const action = {type: RealtimeActions.ACTION_REALTIME_UPDATED_ENTITY_DB, payload: {entityCode, needUpdate, itemsData}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
