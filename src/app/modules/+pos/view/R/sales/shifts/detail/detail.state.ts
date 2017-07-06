import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
export interface ShiftDetail {
  shift: any;
}
export interface ShiftDetailRecord extends TypedRecord<any>, ShiftDetail {}

export const shiftDetailFactory = makeTypedFactory<ShiftDetail, ShiftDetailRecord>({
                                                                                     shift: null
                                                                                   });
