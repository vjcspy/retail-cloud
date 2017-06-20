import {ActionReducer} from "@ngrx/store";
import {ordersStateFactory, OrdersStateRecord} from "./order.state";
import {mergeSliceReducers} from "../../../../../../R/index";
import {listReducer} from "./list/list.reducer";
import {orderDetailReducer} from "./detail/detail.reducer";

const ordersMainReducer: ActionReducer<OrdersStateRecord> = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const ordersReducer = mergeSliceReducers(ordersStateFactory(), ordersMainReducer, listReducer, orderDetailReducer);
