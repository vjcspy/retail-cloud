import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface PaypalState {

}

export interface PaypalStateRecord extends TypedRecord<any>, PaypalState {}

export const makePaypalStateFactory = makeTypedFactory<PaypalState, PaypalStateRecord>({});
