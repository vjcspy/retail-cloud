import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class RetailConfigActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_SAVE_RETAIL_CONFIG_SNAPSHOT = 'ACTION_SAVE_RETAIL_CONFIG_SNAPSHOT';
  
  saveRetailConfigSnapshot(retailConfig, dispatch: boolean = true): Action {
    const action = {type: RetailConfigActions.ACTION_SAVE_RETAIL_CONFIG_SNAPSHOT, payload: {retailConfig}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
