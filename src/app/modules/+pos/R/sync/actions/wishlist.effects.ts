import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosSyncWishlistActions} from "./wishlist.actions";
import {PosQuoteState} from "../../quote/quote.state";
import {Quote} from "../../../core/framework/quote/Model/Quote";
import {PosConfigState} from "../../config/config.state";
import {NotifyManager} from "../../../../../services/notify-manager";
import {PosGeneralState} from "../../general/general.state";
import {PosSyncService} from "../sync.service";
import {RequestService} from "../../../../../services/request";
import {ApiManager} from "../../../../../services/api-manager";
import {RootActions} from "../../../../../R/root.actions";
import {Observable} from "rxjs";
import {PosQuoteActions} from "../../quote/quote.actions";

@Injectable()
export class PosSyncWishlistEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private notifyManager: NotifyManager,
              private syncService: PosSyncService,
              private requestService: RequestService,
              private apiUrl: ApiManager,
              private rootActions: RootActions,
              private posQuoteActions: PosQuoteActions) { }
  
  @Effect() pushWishlistToServer = this.actions$
                                       .ofType(
                                         PosSyncWishlistActions.ACTION_PUSH_WISHLIST
                                       )
                                       .withLatestFrom(this.store$.select('quote'))
                                       .withLatestFrom(this.store$.select('config'), (z, z1) => [...z, z1])
                                       .withLatestFrom(this.store$.select('general'), (z, z1) => [...z, z1])
                                       .filter((z) => {
                                         const posQuoteState: PosQuoteState = (z[1] as PosQuoteState);
                                         const quote: Quote                 = posQuoteState.quote;
                                         const configState: PosConfigState  = <any>z[2];
    
                                         if (!quote.getCustomer() || !quote.getCustomer().getId() ||
                                             parseInt(quote.getCustomer()
                                                           .getId() + '') === parseInt(configState.setting.customer.getDefaultCustomerId())) {
                                           this.notifyManager.error('please_select_customer');
                                           return false;
                                         }
    
                                         if (posQuoteState.items.count() === 0) {
                                           this.notifyManager.warning('nothing_add_wishlist');
                                           return false;
                                         }
    
                                         const hasCustomSales = posQuoteState.items.find((item) => parseInt(item.getData('product_id')) === parseInt(configState.setting.product.getCustomSaleProduct()['id']));
    
                                         if (hasCustomSales) {
                                           this.notifyManager.error('can_not_add_customsale_to_wishlist');
                                           return false;
                                         }
    
                                         return true;
                                       })
                                       .flatMap((z) => {
                                         const posQuoteState: PosQuoteState  = (z[1] as PosQuoteState);
                                         const generalState: PosGeneralState = <any>z[3];
                                         const configState: PosConfigState   = <any>z[2];
    
                                         const order = this.syncService.prepareOrder(posQuoteState, generalState);
    
                                         let dataWishlist = {
                                           items: order['items'],
                                           customer_id: order['customer_id'],
                                           store_id: generalState.store['id']
                                         };
    
                                         return this.requestService
                                                    .makePost(this.apiUrl.get('wishlist', generalState.baseUrl), dataWishlist)
                                                    .map((data) => {
                                                      this.notifyManager.success(data['message']);
                                                      return this.posQuoteActions.clearQuote(false);
                                                    })
                                                    .catch((e) => Observable.of(this.rootActions.error("add_wishlist_error")));
                                       });
}
