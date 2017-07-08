import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
export interface RetailConfigState {
  isSaving: boolean;
}

export interface RetailConfigStateRecord extends TypedRecord<any>, RetailConfigState {}

export const retailConfigStateFactory = makeTypedFactory<RetailConfigState, RetailConfigStateRecord>(
  {
    isSaving: false
  });
