import {List} from "immutable";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface ShiftList {
  shiftGroped: List<any>;
  limitPage: number;
  isResolving: boolean;
}

export interface ShiftListRecord extends TypedRecord<any>, ShiftList {}

export const shiftListFactory = makeTypedFactory<ShiftList, ShiftListRecord>({
                                                                               shiftGroped: List.of(),
                                                                               limitPage: 1,
                                                                               isResolving: false
                                                                             });
