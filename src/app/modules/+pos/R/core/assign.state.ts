import {List} from "immutable";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface PosAssignState {
  assignData: List<string>;
}

export interface PosAssignStateRecord extends TypedRecord<any>, PosAssignState {}

export const posAssignFactory = makeTypedFactory<PosAssignState, PosAssignStateRecord>({
                                                                                         assignData: <any>List.of()
                                                                                       });
