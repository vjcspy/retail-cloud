import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class MenuLeftActions {
  
  constructor(private store$: Store<any>) { }
  
  /**
   ** @REDUCER:
   *
   * Change state open
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_CHANGE_OPEN_STATE = 'ACTION_CHANGE_OPEN_STATE';
  
  changeOpenState(isOpen, dispatch: boolean = true): Action {
    const action = {type: MenuLeftActions.ACTION_CHANGE_OPEN_STATE, payload: {isOpen}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
