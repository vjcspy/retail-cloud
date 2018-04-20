import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class QuoteRefundActions {

  constructor(private store$: Store<any>) { }

  static ACTION_LOAD_CREDITMEMO_QTY_ZERO = 'ACTION_LOAD_CREDITMEMO_QTY_ZERO';
  loadCreditmemoQtyZero(orderSimple: object, dispatch: boolean = true): Action {
    const action = {type: QuoteRefundActions.ACTION_LOAD_CREDITMEMO_QTY_ZERO, payload: {orderSimple}};
    if (dispatch === true) {
      this.store$.dispatch(action);
    }

    return action;
  }

  static ACTION_LOAD_CREDITMEMO = 'ACTION_LOAD_CREDITMEMO';

  loadCreditmemo(orderId: number, isSave: boolean = false, dispatch: boolean = true): Action {
    const action = {type: QuoteRefundActions.ACTION_LOAD_CREDITMEMO, payload: {orderId, isSave}};

    if (dispatch === true) {
      this.store$.dispatch(action);
    }

    return action;
  }

  static ACTION_LOAD_CREDITMEMO_SUCCESS = 'ACTION_LOAD_CREDITMEMO_SUCCESS';

  loadCreditmemoSuccess(creditmemo, dispatch: boolean = true): Action {
    const action = {type: QuoteRefundActions.ACTION_LOAD_CREDITMEMO_SUCCESS, payload: {creditmemo}};

    if (dispatch === true) {
      this.store$.dispatch(action);
    }

    return action;
  }

  static ACTION_LOAD_CREDITMEMO_FAILED = 'ACTION_LOAD_CREDITMEMO_FAILED';

  loadCreditmemoFailed(mess, e, dispatch: boolean = true): Action {
    const action = {type: QuoteRefundActions.ACTION_LOAD_CREDITMEMO_FAILED, payload: {mess, e}};

    if (dispatch === true) {
      this.store$.dispatch(action);
    }

    return action;
  }

  static ACTION_SAVE_CREDITMEMO_SUCCESS = 'ACTION_SAVE_CREDITMEMO_SUCCESS';

  saveCreditmemoSuccess(orderRefunded, dispatch: boolean = true): Action {
    const action = {type: QuoteRefundActions.ACTION_SAVE_CREDITMEMO_SUCCESS, payload: {orderRefunded}};

    if (dispatch === true) {
      this.store$.dispatch(action);
    }

    return action;
  }

  static ACTION_UPDATE_CREDITMEMO_DATA = 'ACTION_UPDATE_CREDITMEMO_DATA';

  updateCreditmemoData(creditmemo, dispatch: boolean = true): Action {
    const action = {type: QuoteRefundActions.ACTION_UPDATE_CREDITMEMO_DATA, payload: {creditmemo}};

    if (dispatch === true) {
      this.store$.dispatch(action);
    }

    return action;
  }
}
