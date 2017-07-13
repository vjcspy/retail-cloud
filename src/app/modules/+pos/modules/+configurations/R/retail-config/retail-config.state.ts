import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
export interface RetailConfigState {
  isSaving: boolean;
  isLoadedDepend: {
    productCategory: boolean;
    customer: boolean;
    payment: boolean;
  };
}

export interface RetailConfigStateRecord extends TypedRecord<any>, RetailConfigState {}

export const retailConfigStateFactory = makeTypedFactory<RetailConfigState, RetailConfigStateRecord>(
  {
    isSaving: false,
    isLoadedDepend: {
      productCategory: false,
      customer: false,
      payment: false,
    }
  });
