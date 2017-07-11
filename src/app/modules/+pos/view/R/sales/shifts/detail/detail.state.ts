import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";
export interface ShiftDetail {
  shift: any;
  amounts: {
    paymentUsed: List<any>;
    totals: {
      sales: number;
      refund: number;
      inOut: number;
      counted: number;
    };
  };
  waitingServer: boolean;
}
export interface ShiftDetailRecord extends TypedRecord<any>, ShiftDetail {}

export const shiftDetailFactory = makeTypedFactory<ShiftDetail, ShiftDetailRecord>({
                                                                                     shift: null,
                                                                                     amounts: {
                                                                                       paymentUsed: List.of(),
                                                                                       totals: {
                                                                                         sales: 0,
                                                                                         refund: 0,
                                                                                         inOut: 0,
                                                                                         counted: 0
                                                                                       }
                                                                                     },
                                                                                     waitingServer: false,
                                                                                   });
