import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface AccountState {
  isProcessing: boolean;
  redirect: string;
}

export interface AccountStateRecord extends TypedRecord<any>, AccountState {}

export const accountStateFactory = makeTypedFactory<AccountState, AccountStateRecord>(
  {
    isProcessing: false,
    redirect: 'cloud/default'
  }
);
