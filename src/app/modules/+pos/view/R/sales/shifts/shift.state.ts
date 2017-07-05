import {ShiftList, shiftListFactory} from "./list/list.state";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface ShiftState {
  list: ShiftList;
}

export interface ShiftStateRecord extends TypedRecord<any>, ShiftState {}

export const shiftStateFactory = makeTypedFactory<ShiftState, ShiftStateRecord>({
                                                                                  list: shiftListFactory()
                                                                                });
