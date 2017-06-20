import {ActionReducer} from "@ngrx/store";
import {OrderDetailRecord} from "./detail.state";
import {ListActions} from "../list/list.actions";

export const orderDetailReducer: ActionReducer<OrderDetailRecord> = (state, action) => {
  switch (action.type) {
    
    case ListActions.ACTION_SELECT_ORDER_DETAIL:
      return state.update('detail', (detail) => {
        return detail.set('order', action.payload['order']);
      });
    
    default:
      return state;
  }
};
