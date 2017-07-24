import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface ConfigurationsClientDbState {
  entities: List<any>;
  syncing: boolean;
}
export interface ConfigurationsClientDbStateRecord extends TypedRecord<any>, ConfigurationsClientDbState {}
export const configurationsClientDbStateFactory = makeTypedFactory<ConfigurationsClientDbState, ConfigurationsClientDbStateRecord>(
  {
    entities: List.of(),
    syncing: false,
  }
);
