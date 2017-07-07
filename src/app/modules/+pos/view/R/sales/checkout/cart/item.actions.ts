import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class CartItemActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_CHANGE_ROW_SELECTED = 'ACTION_CHANGE_ROW_SELECTED';
  
  changeRowSelected(cartItemRowSelected: number) {
    this.store$.dispatch({type: CartItemActions.ACTION_CHANGE_ROW_SELECTED, payload: {cartItemRowSelected}});
  }
  
  static ACTION_UPDATE_CART_ITEM_STYLES = 'ACTION_UPDATE_CART_ITEM_STYLES';
  
  updateCartItemStyles(cartItemsStyle, dispatch: boolean = true): Action {
    const action = {type: CartItemActions.ACTION_UPDATE_CART_ITEM_STYLES, payload: {cartItemsStyle}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
