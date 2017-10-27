import {Action, ActionReducer} from "@ngrx/store";
import {salesStateFactory, SalesStateRecord} from "./state";
import {mergeSliceReducers} from "../../../../R/index";
import {checkoutReducer} from "./checkout/reducer";

const salesMainReducer: ActionReducer<SalesStateRecord> = (state, action: Action) => {
  return state;
};

export const salesReducer = mergeSliceReducers(salesStateFactory(), salesMainReducer, checkoutReducer);
