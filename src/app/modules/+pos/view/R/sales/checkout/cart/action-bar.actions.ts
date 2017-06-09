import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class CartActionBarActions {
  static CHANGE_STATE_NOTE_POPUP = 'CHANGE_STATE_NOTE_POPUP';
  
  constructor(private store$: Store<any>) { }
  
  changeStateNotePopup(state: boolean): void {
    this.store$.dispatch({type: CartActionBarActions.CHANGE_STATE_NOTE_POPUP, payload: {state}})
  }
}
