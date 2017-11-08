import {List} from "immutable";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface MenuElemInterface {
  path: string;
  name: string;
  iconClass?: string;
  ngClass?: () => Object;
  children?: MenuElemInterface[];
  priority: number;
}

export interface MenuState {
  elem: List<MenuElemInterface>;
}

export interface MenuStateRecord extends MenuState, TypedRecord<any> {}

export const menuStateFactory = makeTypedFactory<MenuState, MenuStateRecord>({
                                                                               elem: <any>List.of()
                                                                             }
);
