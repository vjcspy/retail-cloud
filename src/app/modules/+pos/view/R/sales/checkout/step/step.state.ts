import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
export interface PosStepState {
  isStepCheckOut: boolean;
}

export interface PosStepStateRecord extends TypedRecord<any>, PosStepState {}

export const posStepStateFactory = makeTypedFactory<PosStepState, PosStepStateRecord>(
  {
    isStepCheckOut: false
  }
);
