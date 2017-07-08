import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class EntityRetailConfigActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_UPDATE_RETAIL_CONFIG = 'ACTION_UPDATE_RETAIL_CONFIG';
  
  updateRetailConfig(config, dispatch: boolean = true): Action {
    const action = {type: EntityRetailConfigActions.ACTION_UPDATE_RETAIL_CONFIG, payload: {config}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
