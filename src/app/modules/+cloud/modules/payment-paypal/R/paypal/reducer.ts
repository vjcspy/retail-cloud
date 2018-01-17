import {ActionReducer} from "@ngrx/store";
import {makePaypalStateFactory, PaypalStateRecord} from "./state";

export const paypalReducer: ActionReducer<PaypalStateRecord> = (state = makePaypalStateFactory(), action) => {
  return state;
};
