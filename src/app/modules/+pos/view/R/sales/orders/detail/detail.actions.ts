import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class OrderDetailActions {

  constructor(private store$: Store<any>) { }

  static ACTION_MARK_AS_RESYNC = 'ACTION_MARK_AS_RESYNC';

  markAsReSync(orderOffline, dispatch: boolean = true): Action {
    const action = {type: OrderDetailActions.ACTION_MARK_AS_RESYNC, payload: {orderOffline}};

    if (dispatch === true) {
      this.store$.dispatch(action);
    }

    return action;
  }

  static ACTION_SHIP_ORDER = 'ACTION_SHIP_ORDER';

  shipOrder(order, dispatch: boolean = true): Action {
    const action = {type: OrderDetailActions.ACTION_SHIP_ORDER, payload: {order}};

    if (dispatch === true) {
      this.store$.dispatch(action);
    }

    return action;
  }

  static ACTION_SHIP_ORDER_FAILED = 'ACTION_SHIP_ORDER_FAILED';

  shipOrderFailed(mess, e, dispatch: boolean = true): Action {
    const action = {type: OrderDetailActions.ACTION_SHIP_ORDER_FAILED, payload: {mess, e}};

    if (dispatch === true) {
      this.store$.dispatch(action);
    }

    return action;
  }

  static ACTION_NOTE_ORDER = 'ACTION_NOTE_ORDER';
  noteOrder(order, noteData, dispatch: boolean = true): Action {
    const action = {type: OrderDetailActions.ACTION_NOTE_ORDER, payload: {order, noteData}};

    if (dispatch === true) {
      this.store$.dispatch(action);
    }

    return action;
  }

  static ACTION_NOTE_ORDER_FAILED = 'ACTION_NOTE_ORDER_FAILED';
  noteOrderFailed(mess, e, dispatch: boolean = true): Action {
      const action = {type: OrderDetailActions.ACTION_NOTE_ORDER_FAILED, payload: {mess, e}};

      if (dispatch === true) {
          this.store$.dispatch(action);
      }

      return action;
  }
}
