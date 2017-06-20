import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class RootActions {
  static ACTION_NOTHING      = 'ACTION_NOTHING';
  static ACTION_NOTIFY_ERROR = 'ACTION_NOTIFY_ERROR';
  
  constructor(private store$: Store<any>) { }
  
  /**
   ** @REDUCER:
   *
   * Save error
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_ERROR = 'ACTION_ERROR';
  
  error(mess: string, e: any = null, dispatch: boolean = true): Action {
    const action = {type: RootActions.ACTION_ERROR, payload: {e, mess}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
