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
  
  @Effect() triggerCalculateGridStyle = this.actions$
                                            .ofType(CheckoutProductActions.ACTION_SAVE_GRID_WIDTH_HEIGHT)
                                            .switchMap(() => {
                                              return Observable.of({type: CheckoutProductActions.ACTION_CALCULATE_GRID_STYLE})
                                                               .debounceTime(750);
                                            });
  
  @Effect() resolveProductInGrid = this.actions$
                                       .ofType(
                                         CheckoutProductActions.ACTION_CALCULATE_GRID_STYLE,
                                         PosEntitiesActions.ACTION_FILTERED_PRODUCTS,
                                         CheckoutProductActions.ACTION_UPDATE_GRID_STATE,
                                         CheckoutProductActions.ACTION_LOAD_MORE_PAGE
                                       )
                                       .debounceTime(150)
                                       .withLatestFrom(this.store$.select('checkoutProduct'))
                                       .withLatestFrom(this.store$.select('entities'),
                                                       ([action, checkoutProductState], entitiesState) => [action,
                                                                                                           checkoutProductState,
                                                                                                           entitiesState])
                                       .withLatestFrom(this.store$.select('config'), (([action, checkoutProductState, entitiesState], configState) =>
                                         [action, checkoutProductState, entitiesState, configState]))
                                       .filter(([action, checkoutProductState]) => {
                                         return checkoutProductState.productGridNumOfProductPerPage > 0;
                                       })
                                       .switchMap(([action, checkoutProductState, entitiesState, configState]) => {
                                         return Observable.fromPromise(this.checkoutProductsService.resolveSearchProduct(checkoutProductState, entitiesState.products.itemFiltered, configState))
                                                          .map((data: GeneralMessage) => {
                                                            return {
                                                              type: CheckoutProductActions.ACTION_RESOLVE_GRID_PRODUCT, payload: data.data
                                                            };
                                                          });
                                       });
  
}
