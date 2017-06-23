import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface AccountState {
  user: {
    id: string;
    username: string;
    emails: List<any>;
  },
  isLogging: boolean
}

export interface AccountStateRecord extends TypedRecord<any>, AccountState {}

export const accountStateFactory = makeTypedFactory<AccountState, AccountStateRecord>(
  {
    user: {
      id: null,
      username: null,
      emails: List.of()
    },
    isLogging: false
  }
);
