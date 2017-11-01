import {ActionReducer} from "@ngrx/store";
import {ConfigurationRegionStateRecord, configurationsRegionStateFactory} from "./region.state";
import {ConfigurationsRegionActions} from "./region.actions";

export const configurationsRegionReducer: ActionReducer<ConfigurationRegionStateRecord> = (state = configurationsRegionStateFactory(), action) => {
  switch (action.type) {
    case ConfigurationsRegionActions.ACTION_RESOLVE_REGION:
      return state.set('regionFiltered', action.payload['regionFiltered']);
    
    case ConfigurationsRegionActions.ACTION_UPDATE_REGION_FILTER:
      return state.set('filterData', Object.assign({}, state.filterData, action.payload['filterData']));
    
    case ConfigurationsRegionActions.ACTION_LOADED_DEPEND_EDIT_REGION_FORM:
      return state.set('editForm', Object.assign({}, state.editForm, {
        isLoadedDepend: action.payload['isLoadedDepend'],
      }));
    
    case ConfigurationsRegionActions.ACTION_SAVE_REGION:
      return state.set('editForm', Object.assign({}, state.editForm, {
        isSaving: true,
      }));
  
    case ConfigurationsRegionActions.ACTION_SAVE_REGION_FAILED:
    case ConfigurationsRegionActions.ACTION_SAVE_REGION_SUCCESS:
      return state.set('editForm', Object.assign({}, state.editForm, {
        isSaving: false,
      }));
    
    default:
      return state;
  }
};
