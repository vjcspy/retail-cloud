import {ActionReducer} from "@ngrx/store";
import {menuStateFactory, MenuStateRecord} from "./menu.state";
import {mergeSliceReducers} from "../../../../../../R/index";
import {menuLeftReducer} from "./left/left.reducer";

const menuMainReducer: ActionReducer<MenuStateRecord> = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const menuReducer = mergeSliceReducers(menuStateFactory(), menuMainReducer, menuLeftReducer);
