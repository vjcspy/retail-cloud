import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class RealtimeActions {
  
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_RESOLVED_REALTIME = 'ACTION_RESOLVE_REALTIME';
  
  resolvedRealtime(realtimeData, dispatch: boolean = true): Action {
    const action = {type: RealtimeActions.ACTION_RESOLVED_REALTIME, payload: {realtimeData}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
