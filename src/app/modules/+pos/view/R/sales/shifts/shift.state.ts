import {ShiftList, shiftListFactory} from "./list/list.state";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {ShiftDetail, shiftDetailFactory} from "./detail/detail.state";

export interface ShiftState {
  list: ShiftList;
  detail: ShiftDetail;
}

export interface ShiftStateRecord extends TypedRecord<any>, ShiftState {}

export const shiftStateFactory = makeTypedFactory<ShiftState, ShiftStateRecord>({
                                                                                  list: shiftListFactory(),
                                                                                  detail: shiftDetailFactory()
                                                                                });
