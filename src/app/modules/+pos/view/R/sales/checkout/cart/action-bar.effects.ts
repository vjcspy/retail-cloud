import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {CartActionBarActions} from "./action-bar.actions";
import {CartActionBarState} from "./action-bar.state";
import {Observable} from "rxjs";
import {CartActionBarService} from "./action-bar.service";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {RootActions} from "../../../../../../../R/root.actions";

@Injectable()
export class CartActionBarEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private cartActionBarService: CartActionBarService,
              private cartActionBarActions: CartActionBarActions,
              private notify: NotifyManager,
              private posQuoteActions: PosQuoteActions,
              private rootActions: RootActions,
              private quoteActions: PosQuoteActions) { }
  
  @Effect() resolveOrderOnhold = this.actions$
                                     .ofType(
                                       CartActionBarActions.ACTION_CHANGE_MODE_ACTIONS_ORDER_ONHOLD_POPUP,
                                       CartActionBarActions.SEARCH_ORDER_ONHOLD,
                                     )
                                     .withLatestFrom(this.store$.select('cartActionBar'))
                                     .filter((z) => (z[1] as CartActionBarState).isOpenOrderOnhold)
                                     .flatMap((z) => {
                                       const searchString = (z[1] as CartActionBarState).orderOnholdSearchString;
                                       return Observable.fromPromise(this.cartActionBarService.getOrderOnhold())
                                                        .map((mess) => {
                                                          const orders = mess['data']['orders'];
      
                                                          return this.cartActionBarActions.resolvedOrderOnhold(this.cartActionBarService.handleSearchOrderOnhold(orders, searchString), false);
                                                        });
                                     });
  
  @Effect() saveOrderOnhold = this.actions$
                                  .ofType(
                                    CartActionBarActions.ACTION_SAVE_ORDER_ONHOLD
                                  )
                                  .withLatestFrom(this.store$.select('quote'))
                                  .filter((z) => {
                                    if ((z[1] as PosQuoteState).items.count() === 0) {
                                      this.notify.warning('nothing_to_hold');
                                      return false;
                                    }
                                    return true;
                                  })
                                  .flatMap((z) => {
                                    return Observable.fromPromise(this.cartActionBarService.saveOnhold(<any>z[1]))
                                                     .map(() => {
                                                       this.notify.success('save_order_success');
      
                                                       return this.posQuoteActions.clearQuote(false);
                                                     })
                                                     .catch((e) => Observable.of(this.rootActions.error("save_order_failed", null, false)));
                                  });
  
  @Effect() retrieveOrderOnhold = this.actions$
                                      .ofType(
                                        CartActionBarActions.ACTION_RETRIEVE_ORDER_ONHOLD
                                      )
                                      .map((action: Action) => {
                                        const order = action.payload['order'];
                                        return this.quoteActions.reorder({
                                                                           customer: parseInt(order['customer']['id']),
                                                                           items: order['items']
                                                                         }, false);
                                      });
}
