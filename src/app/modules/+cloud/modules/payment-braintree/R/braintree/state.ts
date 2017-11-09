import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface BraintreeState {
  dropinCreated: boolean;
}

export interface BraintreeStateRecord extends BraintreeState, TypedRecord<any> {}

export const makeBraintreeStateFactory = makeTypedFactory<BraintreeState, BraintreeStateRecord>({
                                                                                                  dropinCreated: false
                                                                                                });
