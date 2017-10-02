import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface AccountState {
  user: any;
  isProcessing: boolean;
  redirect: string;
}

export interface AccountStateRecord extends TypedRecord<any>, AccountState {}

export const accountStateFactory = makeTypedFactory<AccountState, AccountStateRecord>(
  {
    user: null,
    isProcessing: false,
    redirect: 'cloud/default'
  }
);
