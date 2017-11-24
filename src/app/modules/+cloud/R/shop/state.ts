import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface ShopManageState {
  isProcessing: boolean;
}

export interface ShopManageStateRecord extends ShopManageState, TypedRecord<any> {}

export const shopManageStateFactory = makeTypedFactory<ShopManageState, ShopManageStateRecord>(
  {isProcessing: false}
);
