import {ShiftList, shiftListFactory} from "./list/list.state";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {ShiftDetail, shiftDetailFactory} from "./detail/detail.state";

export enum SHIFT_POPUP{
  CLOSE_POPUP,
  OPEN_POPUP,
  ADJUST_POPUP
}

export interface ShiftState {
  list: ShiftList;
  detail: ShiftDetail;
  popupOpening: SHIFT_POPUP;
  lastShift: any;
}

export interface ShiftStateRecord extends TypedRecord<any>, ShiftState {}

export const shiftStateFactory = makeTypedFactory<ShiftState, ShiftStateRecord>({
                                                                                  list: shiftListFactory(),
                                                                                  detail: shiftDetailFactory(),
                                                                                  popupOpening: null,
                                                                                  lastShift: null
                                                                                });
