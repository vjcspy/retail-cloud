import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface PosGeneralState {
  baseUrl: string;
  urls: List<any>;
  store: Object;
  register: Object;
  warehouse: Object;
  outlet: Object;
  user: Object;
  redirect: string;
}

export interface PosGeneralStateRecord extends TypedRecord<PosGeneralStateRecord>, PosGeneralState {}

export const posGeneralStateFactory = makeTypedFactory<PosGeneralState, PosGeneralStateRecord>({
                                                                                                 baseUrl: null,
                                                                                                 urls: List.of(),
                                                                                                 store: null,
                                                                                                 register: null,
                                                                                                 warehouse: null,
                                                                                                 outlet: null,
                                                                                                 user: null,
                                                                                                 redirect: 'pos/default/sales/checkout'
                                                                                               });
