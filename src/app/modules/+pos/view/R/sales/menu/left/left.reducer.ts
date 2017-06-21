import {ActionReducer} from "@ngrx/store";
import {MenuStateRecord} from "../menu.state";
import {MenuLeftActions} from "./left.actions";
import {routerActions} from "@ngrx/router-store";

export const menuLeftReducer: ActionReducer<MenuStateRecord> = (state, action) => {
  switch (action.type) {
    case MenuLeftActions.ACTION_CHANGE_OPEN_STATE:
      return state.update('leftMenu', (leftMenu) => {
        return leftMenu.set('isOpen', action.payload['isOpen']);
      });
    
    case routerActions.UPDATE_LOCATION:
      return state.update('leftMenu', (leftMenu) => {
        return leftMenu.set('isOpen', false);
      });
    
    default:
      return state;
  }
};
