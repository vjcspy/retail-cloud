import {ActionReducer} from "@ngrx/store";
import {menuStateFactory, MenuStateRecord} from "./state";
import {MenuActions} from "./actions";

export const menuReducer: ActionReducer<MenuStateRecord> = (state = menuStateFactory(), action) => {
  if (action.type === MenuActions.ACTION_SAVE_CLOUD_MENU) {
    return state.set('elem', action.payload['elem']);
  }
  
  return state;
};
