import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class PosStepActions {
  static ACTION_BACK_CHECKOUT_PAGE = 'ACTION_BACK_CHECKOUT_PAGE';
  
  static ACTION_GET_PAYMENT_METHOD_CAN_USE = 'ACTION_GET_PAYMENT_METHOD_CAN_USE';
  
  constructor(private store$: Store<any>) { }
  
  back() {
    this.store$.dispatch({type: PosStepActions.ACTION_BACK_CHECKOUT_PAGE})
  }
}
