import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class CartTotalsActions {
  static ACTION_CHANGE_DISCOUNT_POPUP_STATE = 'ACTION_CHANGE_DISCOUNT_POPUP_STATE';
  static ACTION_CHANGE_DISCOUNT_TYPE        = 'ACTION_CHANGE_DISCOUNT_TYPE';
  
  constructor(private store$: Store<any>) { }
  
  changeDiscountPopupState(isOpeningPopupDiscount: boolean) {
    this.store$.dispatch({type: CartTotalsActions.ACTION_CHANGE_DISCOUNT_POPUP_STATE, payload: {isOpeningPopupDiscount}});
  }
  
  changeDiscountType(isDiscountWholeOrderValue: boolean) {
    this.store$.dispatch({type: CartTotalsActions.ACTION_CHANGE_DISCOUNT_TYPE, payload: {isDiscountWholeOrderValue}});
  }
}
