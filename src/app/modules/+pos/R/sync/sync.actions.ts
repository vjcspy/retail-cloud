import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class PosSyncActions {
  static ACTION_START_SYNC_CURRENT_ORDER = 'ACTION_START_SYNC_CURRENT_ORDER';
  static ACTION_PREPARE_ORDER_SYNC       = 'ACTION_PREPARE_ORDER_SYNC';
  static ACTION_SYNC_ORDER_SUCCESS       = 'ACTION_SYNC_ORDER_SUCCESS';
  static ACTION_SYNC_ORDER_ERROR         = 'ACTION_SYNC_ORDER_ERROR';
  
  constructor(private store$: Store<any>) { }
  
  syncCurrentOrder() {
    this.store$.dispatch({type: PosSyncActions.ACTION_START_SYNC_CURRENT_ORDER});
  }
}
