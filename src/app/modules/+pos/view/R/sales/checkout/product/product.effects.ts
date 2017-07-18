import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs";
import {PosEntitiesActions} from "../../../../../R/entities/entities.actions";
import {GeneralMessage} from "../../../../../services/general/message";
import {CheckoutProductService} from "./product.service";
import {CheckoutProductActions} from "./product.actions";
import {CheckoutProductCategoryActions} from "./category/category.actions";
import {Router} from "@angular/router";

@Injectable()
export class CheckoutProductEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions,
              private checkoutProductsService: CheckoutProductService,
              private router: Router) { }
  
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
                                         CheckoutProductActions.ACTION_LOAD_MORE_PAGE,
                                         CheckoutProductActions.ACTION_CHANGE_VIEW_MODE,
                                         CheckoutProductCategoryActions.ACTION_SELECT_CATEGORY
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
                                         return Observable.fromPromise(this.checkoutProductsService.resolveSearchProduct(<any>checkoutProductState, (entitiesState as any).products.itemFiltered, <any>configState))
                                                          .map((data: GeneralMessage) => {
                                                            return {
                                                              type: CheckoutProductActions.ACTION_RESOLVE_GRID_PRODUCT, payload: data.data
                                                            };
                                                          });
                                       });
  
}
