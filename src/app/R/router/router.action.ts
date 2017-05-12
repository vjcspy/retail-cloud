import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../index";

@Injectable()
export class RouterActions {
  static NAVIGATE          = 'NAVIGATE';
  static NAVIGATE_SUCCESS = 'NAVIGATE_SUCCESS';
  static NAVIGATE_FAILED   = 'NAVIGATE_FAILED';
  
  constructor(private store: Store<AppState>) { }
  
  navigate(data): void {
    this.store.dispatch({type: RouterActions.NAVIGATE, payload: data});
  }
}
