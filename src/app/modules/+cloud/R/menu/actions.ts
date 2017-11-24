import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class MenuActions {
  
  constructor(protected store$: Store<any>) { }
  
  static ACTION_INIT_CLOUD_MENU = 'ACTION_INIT_CLOUD_MENU';
  
  initCloudMenu(dispatch: boolean = true): Action {
    const action = {type: MenuActions.ACTION_INIT_CLOUD_MENU, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_CLOUD_MENU = 'ACTION_SAVE_CLOUD_MENU';
  
  saveCloudMenu(elem, dispatch: boolean = true): Action {
    const action = {type: MenuActions.ACTION_SAVE_CLOUD_MENU, payload: {elem}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_TOGGLE_MENU = 'ACTION_TOGGLE_MENU';
  
  toggleMenu(dispatch: boolean = true): Action {
    const action = {type: MenuActions.ACTION_TOGGLE_MENU, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
