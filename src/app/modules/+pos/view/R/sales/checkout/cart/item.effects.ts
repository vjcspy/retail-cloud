import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {CartTotalsActions} from "./totals.actions";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {CartItemActions} from "./item.actions";

@Injectable()
export class CartItemEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions,
              private cartItemsActions: CartItemActions) { }
  
  @Effect() recalculateCartStyle = this.actions$
                                       .ofType(
                                         CartTotalsActions.ACTION_TOGGLE_BLOCK_TOTAL_STATE,
                                         PosQuoteActions.ACTION_RESOLVE_QUOTE,
                                         PosQuoteActions.ACTION_CLEAR_QUOTE,
                                       )
                                       .debounceTime(500)
                                       .map(() => {
                                         let cartTotalHeight = jQuery('#cart-totals-comp').height();
                                         if (isNaN(cartTotalHeight)) {
                                           cartTotalHeight = 0;
                                         }
                                         return this.cartItemsActions.updateCartItemStyles({height: `calc(100% - ${cartTotalHeight}px)`}, false);
                                       });
}
