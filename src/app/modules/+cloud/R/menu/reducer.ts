import {ActionReducer} from "@ngrx/store";
import {MenuElemInterface, menuStateFactory, MenuStateRecord} from "./state";
import {MenuActions} from "./actions";
import {List} from "immutable";
import * as _ from 'lodash';

export const menuReducer: ActionReducer<MenuStateRecord> = (state = menuStateFactory(), action) => {
  if (action.type === MenuActions.ACTION_SAVE_CLOUD_MENU) {
    return state.set('elem', List.of(...sortMenu(action.payload['elem'])));
  }
  
  return state;
};

function sortMenu(menu: MenuElemInterface[]): MenuElemInterface[] {
  menu = <any>menu.sort((a: MenuElemInterface, b: MenuElemInterface) => (a.priority - b.priority));
  
  menu = <any>menu.map((_menu: MenuElemInterface) => {
    if (_.isArray(_menu.children) && _.size(_menu.children) > 0) {
      _menu.children = sortMenu(_menu.children);
    }
    return _menu;
  });
  
  return menu;
}
