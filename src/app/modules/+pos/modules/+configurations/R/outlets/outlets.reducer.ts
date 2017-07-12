import {ActionReducer} from "@ngrx/store";
import {ConfigurationOutletStateRecord, configurationsOutletStateFactory} from "./outlet.state";
import {ConfigurationsOutletActions} from "./outlet.actions";

export const configurationsOutletReducer: ActionReducer<ConfigurationOutletStateRecord> = (state = configurationsOutletStateFactory(), action) => {
  switch (action.type) {
    case ConfigurationsOutletActions.ACTION_RESOLVE_OUTLET:
      return state.set('outletFiltered', action.payload['outletFiltered']);
    
    case ConfigurationsOutletActions.ACTION_UPDATE_OUTLET_FILTER:
      return state.set('filterData', Object.assign({}, state.filterData, action.payload['filterData']));
    
    case ConfigurationsOutletActions.ACTION_LOADED_DEPEND_EDIT_FORM:
      return state.set('editForm', Object.assign({}, state.editForm, {
        isLoadedDepend: action.payload['isLoadedDepend'],
      }));
    
    case ConfigurationsOutletActions.ACTION_SAVE_REGISTER:
    case ConfigurationsOutletActions.ACTION_SAVE_OUTLET:
      return state.set('editForm', Object.assign({}, state.editForm, {
        isSaving: true,
      }));
    
    case ConfigurationsOutletActions.ACTION_SAVE_OUTLET_FAILED:
    case ConfigurationsOutletActions.ACTION_SAVE_OUTLET_SUCCESS:
      return state.set('editForm', Object.assign({}, state.editForm, {
        isSaving: false,
      }));
    
    default:
      return state;
  }
};
