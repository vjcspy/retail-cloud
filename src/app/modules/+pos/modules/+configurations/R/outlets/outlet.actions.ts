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
  
  static ACTION_LOADED_DEPEND_EDIT_FORM = 'ACTION_LOADED_DEPEND_EDIT_FORM';
  
  loadedDependEditForm(isLoadedDepend, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsOutletActions.ACTION_LOADED_DEPEND_EDIT_FORM, payload: {isLoadedDepend}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_EDIT_OUTLET = 'ACTION_EDIT_OUTLET';
  
  editOutlet(id: number, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsOutletActions.ACTION_EDIT_OUTLET, payload: {id}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_RESOLVE_EDIT_OUTLET_FORM = 'ACTION_RESOLVE_EDIT_OUTLET_FORM';
  
  resolveEditOutletForm(outlet, registers, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsOutletActions.ACTION_RESOLVE_EDIT_OUTLET_FORM, payload: {outlet, registers}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
