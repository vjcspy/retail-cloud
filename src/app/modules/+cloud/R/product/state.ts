import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface ProductState {
  processing: boolean;
}

export interface ProductStateRecord extends ProductState, TypedRecord<any> {}

export const productStateFactory = makeTypedFactory<ProductState, ProductStateRecord>(
  {
    processing: false,
  }
);
