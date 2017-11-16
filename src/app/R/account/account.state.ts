import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface AccountState {
  user: {
    id: string;
    username: string;
    emails: List<any>;
    baseUrl : string;
  },
  license: {
    licenseHasPos: any;
  };
  isLogging: boolean;
  redirect: string;
  isAutoLogin : boolean;
}

export interface AccountStateRecord extends TypedRecord<any>, AccountState {}

export const accountStateFactory = makeTypedFactory<AccountState, AccountStateRecord>(
  {
    user: {
      id: null,
      username: null,
      emails: List.of(),
      baseUrl : null
    },
    license: {
      licenseHasPos: null,
    },
    isLogging: false,
    redirect: 'pos/default/sales/checkout',
    isAutoLogin : false
  }
);
