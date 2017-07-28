import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class OrderDetailActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_MARK_AS_RESYNC = 'ACTION_MARK_AS_RESYNC';
  
  markAsReSync(orderOffline, dispatch: boolean = true): Action {
    const action = {type: OrderDetailActions.ACTION_MARK_AS_RESYNC, payload: {orderOffline}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
