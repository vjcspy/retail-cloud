import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs";
import {PosEntitiesActions} from "../../../../../R/entities/entities.actions";
import {GeneralMessage} from "../../../../../services/general/message";
import {CheckoutProductService} from "./product.service";
import {CheckoutProductActions} from "./product.actions";

@Injectable()
export class CheckoutProductEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private checkoutProductsService: CheckoutProductService) { }
  
  /*----------------------------------------- GRID PRODUCT -----------------------------------------*/
  @Effect() calculateStyleAfterSaveCurrentWidthHeight = this.actions$
                                                            .ofType(CheckoutProductActions.ACTION_SAVE_GRID_WIDTH_HEIGHT)
                                                            .debounceTime(100)
                                                            .switchMap(() => {
                                                              return Observable.of({type: CheckoutProductActions.ACTION_CALCULATE_GRID_STYLE})
                                                                               .debounceTime(750);
                                                            });
  
  @Effect() resolveProductInGrid = this.actions$
                                       .ofType(
                                         CheckoutProductActions.ACTION_CALCULATE_GRID_STYLE,
                                         PosEntitiesActions.ACTION_FILTERED_PRODUCTS,
                                         CheckoutProductActions.ACTION_UPDATE_GRID_STATE
                                       )
                                       .withLatestFrom(this.store$.select('productOptions'))
                                       .withLatestFrom(this.store$.select('entities'),
                                                       ([action, checkoutState], entitiesState) => [action, checkoutState, entitiesState])
                                       .withLatestFrom(this.store$.select('config'), (([action, checkoutState, entitiesState], configState) =>
                                         [action, checkoutState, entitiesState, configState]))
                                       .filter(([action, productOptionsState, entitiesState, configState]) => {
                                         return productOptionsState.productGridNumOfProductPerPage > 0 && entitiesState.products.itemFiltered.count() > 0;
                                       })
                                       .switchMap(([action, checkoutState, entitiesState, configState]) => {
                                         return Observable.fromPromise(this.checkoutProductsService.resolveSearchProduct(checkoutState, entitiesState.products.itemFiltered, configState))
                                                          .map((data: GeneralMessage) => {
                                                            return {
                                                              type: CheckoutProductActions.ACTION_RESOLVE_GRID_PRODUCT, payload: data.data
                                                            };
                                                          });
                                       });
  
}
