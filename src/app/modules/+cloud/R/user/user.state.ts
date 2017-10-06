import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface UserState {

}

export interface UserStateRecord extends UserState, TypedRecord<any> {}

export const userStateFactory = makeTypedFactory<UserState, UserStateRecord>(
  {}
);
