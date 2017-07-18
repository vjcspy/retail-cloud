import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface ConfigurationsReceiptState {
  receipt: any;
  isLoadedDependency: boolean;
  isSaving: boolean;
}

export interface ConfigurationsReceiptStateRecord extends TypedRecord<any>, ConfigurationsReceiptState {}

export const makeConfigurationsReceiptStateFactory = makeTypedFactory<ConfigurationsReceiptState, ConfigurationsReceiptStateRecord>(
  {
    receipt: null,
    isLoadedDependency: false,
    isSaving: false
  }
);
