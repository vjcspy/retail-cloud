import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface PosGeneralState {
  store: any;
  register: any;
  warehouse: any;
  outlet: any;
}

export interface PosStateRecord extends TypedRecord<PosStateRecord>, PosGeneralState {}

export const posGeneralStateFactory = makeTypedFactory<PosGeneralState, PosStateRecord>({
                                                                                          store: null,
                                                                                          register: null,
                                                                                          warehouse: null,
                                                                                          outlet: null
                                                                                        });
