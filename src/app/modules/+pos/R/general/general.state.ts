import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface PosGeneralState {
  baseUrl: string;
  store: Object;
  register: Object;
  warehouse: Object;
  outlet: Object;
}

export interface PosGeneralStateRecord extends TypedRecord<PosGeneralStateRecord>, PosGeneralState {}

export const posGeneralStateFactory = makeTypedFactory<PosGeneralState, PosGeneralStateRecord>({
                                                                                                 baseUrl: "https://magento2demo.connectpos.com",
                                                                                                 // baseUrl: "http://mage2.dev",
                                                                                                 store: {},
                                                                                                 register: {},
                                                                                                 warehouse: {},
                                                                                                 outlet: {}
                                                                                               });
