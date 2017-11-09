import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface AccountState {
  user: any;
  license :any;
  urls: List<any>;
  default_url :any;
  isProcessing: boolean;
  redirect: string;
}

export interface AccountStateRecord extends TypedRecord<any>, AccountState {}

export const accountStateFactory = makeTypedFactory<AccountState, AccountStateRecord>(
  {
    user: null,
    license :null,
    urls: List.of(),
    default_url :null,
    isProcessing: false,
    redirect: 'cloud/default'
  }
);
