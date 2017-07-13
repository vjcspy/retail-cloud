import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
export interface ConfigurationsPaymentState {
  isSaving: boolean;
}

export interface ConfigurationsPaymentStateRecord extends TypedRecord<any>, ConfigurationsPaymentState {}

export const configurationsStateFactory = makeTypedFactory<ConfigurationsPaymentState, ConfigurationsPaymentStateRecord>(
  {
    isSaving: false
  }
);
