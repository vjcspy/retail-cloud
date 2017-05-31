import {Action, ActionReducer} from "@ngrx/store";
import {salesStateFactory, SalesStateRecord} from "./sales.state";

export const salesReducer: ActionReducer<SalesStateRecord> = (state: SalesStateRecord = salesStateFactory(), action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
