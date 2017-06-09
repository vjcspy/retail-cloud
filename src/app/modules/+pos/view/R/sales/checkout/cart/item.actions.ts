import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class CartItemActions {
  static ACTION_CHANGE_ROW_SELECTED = 'ACTION_CHANGE_ROW_SELECTED';
  
  constructor(private store$: Store<any>) { }
  
  changeRowSelected(cartItemRowSelected: number) {
    this.store$.dispatch({type: CartItemActions.ACTION_CHANGE_ROW_SELECTED, payload: {cartItemRowSelected}});
  }
}
