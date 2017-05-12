import {Action} from "@ngrx/store";
import {SalesReportActions} from "./sales-report.action";
import {Map} from "immutable";
export interface SalesReportState {
  headerState?: string;
  headerDescription?: string;
}

export const salesReportReducer = (state: SalesReportState = {}, action: Action): SalesReportState => {
  switch (action.type) {
    case SalesReportActions.ROUTER_NAVIGATED_ADVANCED_REPORT:
      return Map(state).mergeDeep(Map(action.payload)).toJS();
      
    default:
      return state;
  }
};
