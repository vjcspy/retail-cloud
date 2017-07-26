import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {EntityCustomerActions} from "../../../../../R/entities/entity/customer.actions";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {CheckoutPopupActions} from "./popup.actions";
import {EntityCustomerService} from "../../../../../R/entities/entity/customer.service";
import {PosGeneralState} from "../../../../../R/general/general.state";
import {ProgressBarService} from "../../../../../../share/provider/progess-bar";
import {OfflineService} from "../../../../../../share/provider/offline";
import {ProductDB} from "../../../../../database/xretail/db/product";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {List} from "immutable";
import {CheckoutPopupService} from "./popup.service";

@Injectable()
export class CheckoutPopupEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private quoteActions: PosQuoteActions,
              private entityCustomerService: EntityCustomerService,
              private checkoutPopupActions: CheckoutPopupActions,
              private progessBar: ProgressBarService,
              private checkoutPopupService: CheckoutPopupService,
              private onlineOflline: OfflineService) { }
  
  @Effect() afterSaveCustomerAddress = this.actions$
                                           .ofType(
                                             EntityCustomerActions.ACTION_SAVE_CUSTOMER_ADDRESS_SUCCESSFULLY
                                           )
                                           .map((action) => {
                                             const customer    = action.payload['customer'];
                                             const addressType = action.payload['addressType'];
    
                                             return this.quoteActions.setCustomerToQuote(customer, addressType === 'billing', addressType === 'shipping', false);
                                           });
  
  @Effect() viewCustomerOtherInfo = this.actions$
                                        .ofType(
                                          CheckoutPopupActions.ACTION_VIEW_CUSTOMER_OTHER_INFO
                                        )
                                        .filter(() => this.onlineOflline.online)
                                        .withLatestFrom(this.store$.select('general'))
                                        .withLatestFrom(this.store$.select('entities'), (z, z1) => [...z, z1])
                                        .switchMap((z: any) => {
                                          const generalState: PosGeneralState = z[1];
                                          const action: Action                = z[0];
                                          const products: List<ProductDB>     = (z[2] as PosEntitiesState).products.items;
                                          this.progessBar.start();
    
                                          return this.entityCustomerService.createGetCustomerOtherInfoRequest(action.payload['customer'], generalState)
                                                     .map((data) => {
                                                       this.progessBar.done();
                                                       return this.checkoutPopupActions.getCustomerOtherInfoSuccess({
                                                                                                                      rp_point_balance: data['rp_point_balance'],
                                                                                                                      life_time_sales: data['life_time_sales'],
                                                                                                                      wishlistItems: this.checkoutPopupService.prepareWishlistItem(data['wishlist'], products)
                                                                                                                    }, false);
                                                     });
                                        });
}
