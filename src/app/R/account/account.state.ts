import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface AccountState {
  user: {
    id: string;
    username: string;
    emails: List<any>;
    baseUrl : string;
    role : string;
  },
  license :any;
  isProcessing: boolean;
  redirect: string;
}

export interface AccountStateRecord extends TypedRecord<any>, AccountState {}

export const accountStateFactory = makeTypedFactory<AccountState, AccountStateRecord>(
  {
    user: {
      id: null,
      username: null,
      emails: List.of(),
      baseUrl : null,
      role : null
    },
    license :null,
    isProcessing: false,
    redirect: 'cloud/default/sale-report'
  }
);
