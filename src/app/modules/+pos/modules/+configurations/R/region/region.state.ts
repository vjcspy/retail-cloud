import {List} from "immutable";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface ConfigurationsRegionState {
  regionFiltered: List<any>;
  filterData: {
    id: string,
    region_name: string
    assigned_outlets: string;
  };
  editForm: {
    isLoadedDepend: boolean;
    region: Object;
    isSaving: boolean;
  };
}

export interface ConfigurationRegionStateRecord extends TypedRecord<any>, ConfigurationsRegionState {}

export const configurationsRegionStateFactory = makeTypedFactory<ConfigurationsRegionState, ConfigurationRegionStateRecord>(
  {
    regionFiltered: List.of(),
    filterData: {
      id: null,
      region_name: null,
      assigned_outlets : null
    },
    editForm: {
      isLoadedDepend: false,
      region: {},
      isSaving: false
    }
  }
);
