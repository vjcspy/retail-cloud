import {ActionReducer} from "@ngrx/store";
import {EntityRecord} from "../entities.model";
import {PosStepActions} from "../../../view/R/sales/checkout/step/step.actions";

export const entityOrderReducer: ActionReducer<EntityRecord> = (state, action) => {
  switch (action.type) {
    case PosStepActions.ACTION_SAVED_ORDER:
      // return state.updateIn(['orders', 'items'], (orders) => orders.push(action.payload['orderOffline']));
    
    default:
      return state;
  }
};
