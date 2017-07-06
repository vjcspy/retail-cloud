import {List} from "immutable";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface ShiftList {
  shifts: List<any>;
  shiftGroped: List<any>;
  currentPage: number;
  limitPage: number;
  lastPageNumber: number;
  isResolving: boolean;
}

export interface ShiftListRecord extends TypedRecord<any>, ShiftList {}

export const shiftListFactory = makeTypedFactory<ShiftList, ShiftListRecord>({
                                                                               shifts: List.of(),
                                                                               shiftGroped: List.of(),
                                                                               currentPage: 0,
                                                                               limitPage: 1,
                                                                               lastPageNumber: 1,
                                                                               isResolving: true,
                                                                             });
