import {List} from "immutable";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface ConfigurationsOutletState {
  outletFiltered: List<any>;
  filterData: {
    id: string,
    name: string,
    store_id: string,
    is_active: boolean,
    warehouse_id: string
  };
  editForm: {
    isLoadedDepend: boolean;
    outlet: Object;
    registers: List<any>;
  };
}

export interface ConfigurationOutletStateRecord extends TypedRecord<any>, ConfigurationsOutletState {}

export const configurationsOutletStateFactory = makeTypedFactory<ConfigurationsOutletState, ConfigurationOutletStateRecord>(
  {
    outletFiltered: List.of(),
    filterData: {
      id: null,
      name: null,
      store_id: null,
      is_active: null,
      warehouse_id: null
    },
    editForm: {
      isLoadedDepend: false,
      outlet: {},
      registers: List.of()
    }
  }
);
