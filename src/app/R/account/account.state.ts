import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface AccountState {
  user: {
    id: string;
    username: string;
    emails: List<any>;
  };
  license: {
    licenseHasPos: any;
  };
  isProcessing: boolean;
  redirect: string;
}

export interface AccountStateRecord extends TypedRecord<any>, AccountState {}

export const accountStateFactory = makeTypedFactory<AccountState, AccountStateRecord>(
  {
    user: {
      id: null,
      username: null,
      emails: List.of()
    },
    license: {
      licenseHasPos: null,
    },
    isProcessing: false,
    redirect: 'account/logout'
  }
);
