import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class CartActionBarActions {
  constructor(private store$: Store<any>) { }
  
  static CHANGE_STATE_NOTE_POPUP = 'CHANGE_STATE_NOTE_POPUP';
  
  changeStateNotePopup(state: boolean): void {
    this.store$.dispatch({type: CartActionBarActions.CHANGE_STATE_NOTE_POPUP, payload: {state}})
  }
  
  static ACTION_CHANGE_MODE_ACTIONS_POPUP = 'ACTION_CHANGE_MODE_ACTIONS_POPUP';
  
  changeModeActionPopup(isOpenActions, dispatch: boolean = true): Action {
    const action = {type: CartActionBarActions.ACTION_CHANGE_MODE_ACTIONS_POPUP, payload: {isOpenActions}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
