import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ConfigurationsOutletActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_RESOLVE_OUTLET = 'ACTION_RESOLVE_OUTLET';
  
  resolveOutlet(outletFiltered, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsOutletActions.ACTION_RESOLVE_OUTLET, payload: {outletFiltered}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_UPDATE_OUTLET_FILTER = 'ACTION_UPDATE_OUTLET_FILTER';
  
  updateOutletFilter(filterData, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsOutletActions.ACTION_UPDATE_OUTLET_FILTER, payload: {filterData}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
