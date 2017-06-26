import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface AccountState {
  user: {
    id: string;
    username: string;
    emails: List<any>;
  },
  license: {
    licenseHasPos: any;
  };
  isLogging: boolean;
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
    isLogging: false,
    redirect: 'pos/default/sales/checkout'
  }
);
