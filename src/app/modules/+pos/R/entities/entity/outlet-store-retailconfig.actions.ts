import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class GeneralEntityActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_CLEARED_GENERAL_DB = 'ACTION_CLEARED_GENERAL_DB';
  
  clearedGeneralEntityIndexData(dispatch: boolean = true): Action {
    const action = {type: GeneralEntityActions.ACTION_CLEARED_GENERAL_DB, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
