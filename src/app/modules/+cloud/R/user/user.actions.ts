import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class UserActions {
  constructor(protected store$: Store<any>) { }
  
  static ACTION_SAVE_USER = 'ACTION_SAVE_USER';
  
  saveUser(user, dispatch: boolean = true): Action {
    const action = {type: UserActions.ACTION_SAVE_USER, payload: {user}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
