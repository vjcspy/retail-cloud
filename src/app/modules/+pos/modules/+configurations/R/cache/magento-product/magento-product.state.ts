import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface MagentoProductState {
  pulledInstance: boolean;
  syncing: boolean;
  instances: List<any>;
}
export interface MagentoProductStateRecord extends TypedRecord<any>, MagentoProductState {}
export const magentoProductStateFactory = makeTypedFactory<MagentoProductState, MagentoProductStateRecord>(
  {
    pulledInstance: false,
    syncing: false,
    instances: List.of()
  });

