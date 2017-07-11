import {List} from "immutable";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface ShiftList {
  shifts: List<any>;
  shiftGroped: List<any>;
  currentPage: number;
  lastPageNumber: number;
  isLoadingFromServer: boolean;
}

export interface ShiftListRecord extends TypedRecord<any>, ShiftList {}

export const shiftListFactory = makeTypedFactory<ShiftList, ShiftListRecord>({
                                                                               shifts: List.of(),
                                                                               shiftGroped: List.of(),
                                                                               currentPage: 0,
                                                                               lastPageNumber: 1,
                                                                               isLoadingFromServer: false,
                                                                             });
