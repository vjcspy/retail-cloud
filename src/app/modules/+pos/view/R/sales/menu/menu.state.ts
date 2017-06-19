import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
export interface LeftMenu {
  isOpen: boolean;
}
export interface LefMenuRecord extends TypedRecord<any>, LeftMenu {}

export const leftMenuFactory = makeTypedFactory<LeftMenu, LefMenuRecord>(
  {
    isOpen: false
  });

export interface MenuState {
  leftMenu: LeftMenu
}

export interface MenuStateRecord extends TypedRecord<any>, MenuState {}

export const menuStateFactory = makeTypedFactory<MenuState, MenuStateRecord>(
  {
    leftMenu: leftMenuFactory()
  }
);
