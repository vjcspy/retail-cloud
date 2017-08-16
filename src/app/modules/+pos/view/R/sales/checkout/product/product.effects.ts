import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs";
import {PosEntitiesActions} from "../../../../../R/entities/entities.actions";
import {GeneralMessage} from "../../../../../services/general/message";
import {CheckoutProductService} from "./product.service";
import {CheckoutProductActions} from "./product.actions";
import {CheckoutProductCategoryActions} from "./category/category.actions";
import {Router} from "@angular/router";
import {CheckoutProductState} from "./product.state";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {RealtimeActions} from "../../../../../R/entities/realtime/realtime.actions";
import {CategoryDB} from "../../../../../database/xretail/db/category";

@Injectable()
export class CheckoutProductEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private checkoutProductsService: CheckoutProductService,
              private checkoutProductActions: CheckoutProductActions,
              private router: Router,
              private quoteActions: PosQuoteActions) { }
  
  @Effect() triggerCalculateGridStyle = this.actions$
                                            .ofType(CheckoutProductActions.ACTION_SAVE_GRID_WIDTH_HEIGHT)
                                            .switchMap(() => {
                                              return Observable.of({type: CheckoutProductActions.ACTION_CALCULATE_GRID_STYLE})
                                                               .debounceTime(750);
                                            });
  
  @Effect() resolveProductInCategory = this.actions$
                                           .ofType(
                                             PosEntitiesActions.ACTION_FILTERED_PRODUCTS,
                                             CheckoutProductCategoryActions.ACTION_SELECT_CATEGORY,
                                             RealtimeActions.ACTION_REALTIME_UPDATED_ENTITY_DB
                                           )
                                           .filter((action: Action) => action.payload.hasOwnProperty('entityCode') ?
                                             action.payload['entityCode'] === CategoryDB : true)
                                           .filter(() => this.router.isActive('/pos/default/sales/checkout', false))
                                           .withLatestFrom(this.store$.select('checkoutProduct'))
                                           .withLatestFrom(this.store$.select('entities'), (z, z1) => [...z, z1])
                                           .switchMap((z: any) => {
                                             const productFiltered = (z[2] as PosEntitiesState).products.itemFiltered;
    
                                             return Observable.fromPromise(this.checkoutProductsService.resolveCatalogProduct(z[1], productFiltered))
                                                              .map((mess) => this.checkoutProductActions.resolveCatalogProduct(mess['data']['catalogProducts'], false));
                                           });
  
  @Effect() resolveProductInGrid = this.actions$
                                       .ofType(
                                         CheckoutProductActions.ACTION_CALCULATE_GRID_STYLE,
                                         CheckoutProductActions.ACTION_UPDATE_GRID_STATE,
                                         CheckoutProductActions.ACTION_LOAD_MORE_PAGE,
                                         CheckoutProductActions.ACTION_CHANGE_VIEW_MODE,
                                         CheckoutProductActions.ACTION_RESOLVE_CATALOG_PRODUCT
                                       )
                                       .filter(() => this.router.isActive('/pos/default/sales/checkout', false))
                                       .debounceTime(150)
                                       .withLatestFrom(this.store$.select('checkoutProduct'))
                                       .withLatestFrom(this.store$.select('entities'),
                                                       ([action, checkoutProductState], entitiesState) => [action,
                                                                                                           checkoutProductState,
                                                                                                           entitiesState])
                                       .withLatestFrom(this.store$.select('config'), (([action, checkoutProductState, entitiesState], configState) =>
                                         [action, checkoutProductState, entitiesState, configState]))
                                       .filter(([action, checkoutProductState]) => {
                                         return (checkoutProductState as any).productGridNumOfProductPerPage > 0;
                                       })
                                       .switchMap(([action, checkoutProductState, entitiesState, configState]) => {
                                         return Observable.fromPromise(this.checkoutProductsService.resolveSearchProduct(<any>checkoutProductState, (checkoutProductState as CheckoutProductState).catalogProducts, <any>configState))
                                                          .map((data: GeneralMessage) => {
                                                            return this.checkoutProductActions.resolvedGridProduct(data.data, false);
                                                          });
                                       });
  
  @Effect() luckySearch = this.actions$
                              .ofType(CheckoutProductActions.ACTION_RESOLVE_GRID_PRODUCT)
                              .withLatestFrom(this.store$.select('checkoutProduct'))
                              .filter((z: any) => {
                                const checkoutProductState: CheckoutProductState = z[1];
                                return checkoutProductState.productGridProducts.count() === 1 && checkoutProductState.searchString !== null && checkoutProductState.searchString !== checkoutProductState.lastLuckySearchString;
                              })
                              .flatMap((z: any) => {
                                const checkoutProductState: CheckoutProductState = z[1];
                                const product                                    = checkoutProductState.productGridProducts.first();
                                jQuery('#pos_search_text').select();
                                return Observable.from([
                                                         this.checkoutProductActions.updateGridState({lastLuckySearchString: checkoutProductState.searchString}, false),
                                                         this.quoteActions.selectProductToAdd(product, 1, false, null, false, false)
                                                       ]);
                              });
}
