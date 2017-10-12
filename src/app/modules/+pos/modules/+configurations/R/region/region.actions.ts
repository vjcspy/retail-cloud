import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ConfigurationsRegionActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_RESOLVE_REGION = 'ACTION_RESOLVE_REGION';
  
  resolveRegion(regionFiltered, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsRegionActions.ACTION_RESOLVE_REGION, payload: {regionFiltered}};
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    return action;
  }
  
  static ACTION_UPDATE_REGION_FILTER = 'ACTION_UPDATE_REGION_FILTER';
  
  updateRegionFilter(filterData, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsRegionActions.ACTION_UPDATE_REGION_FILTER, payload: {filterData}};
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    return action;
  }
  
  static ACTION_LOADED_DEPEND_EDIT_REGION_FORM = 'ACTION_LOADED_DEPEND_EDIT_REGION_FORM';
  
  loadedDependEditForm(isLoadedDepend, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsRegionActions.ACTION_LOADED_DEPEND_EDIT_REGION_FORM, payload: {isLoadedDepend}};
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    return action;
  }
  
  static ACTION_RESOLVE_EDIT_REGION_FORM = 'ACTION_RESOLVE_EDIT_REGION_FORM';
  
  resolveEditRegionForm(formData, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsRegionActions.ACTION_RESOLVE_EDIT_REGION_FORM, payload: {formData}};
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    return action;
  }
  
  static ACTION_EDIT_REGION = 'ACTION_EDIT_REGION';
  editRegion(id: number, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsRegionActions.ACTION_EDIT_REGION, payload: {id}};
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    return action;
  }
  static ACTION_SAVE_REGION = 'ACTION_SAVE_REGION';
  
  saveRegion(region, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsRegionActions.ACTION_SAVE_REGION, payload: {region}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_REGION_SUCCESS = 'ACTION_SAVE_REGION_SUCCESS';
  
  saveRegionSuccess(region, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsRegionActions.ACTION_SAVE_REGION_SUCCESS, payload: {region}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SAVE_REGION_FAILED = 'ACTION_SAVE_REGION_FAILED';
  saveRegionFailed(mess, e = null, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsRegionActions.ACTION_SAVE_REGION_FAILED, payload: {mess}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_DELETE_REGION = 'ACTION_DELETE_REGION';
  deleteRegion(id: number, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsRegionActions.ACTION_DELETE_REGION, payload: {id}};
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    return action;
  }
  
  static ACTION_DELETE_REGION_SUCCESS = 'ACTION_DELETE_REGION_SUCCESS';
  
  deleteRegionSuccess(regionId, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsRegionActions.ACTION_DELETE_REGION_SUCCESS, payload: {regionId}};
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_DELETE_REGION_FAILED = 'ACTION_DELETE_REGION_FAILED';
  deleteRegionFailed(mess, e = null, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsRegionActions.ACTION_DELETE_REGION_FAILED, payload: {mess}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
