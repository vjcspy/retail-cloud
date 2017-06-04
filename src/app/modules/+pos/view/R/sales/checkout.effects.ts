import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosCheckoutActions} from "./checkout.actions";
import {Observable} from "rxjs";
import {PosCheckoutService} from "./checkout.service";
import {GeneralMessage} from "../../../services/general/message";
import {PosEntitiesActions} from "../../../R/entities/entities.actions";
import {CustomerDB} from "../../../database/xretail/db/customer";
import {Entity} from "../../../R/entities/entities.model";
import * as _ from "lodash";

@Injectable()
export class PosCheckoutEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private checkoutService: PosCheckoutService) { }
  
  @Effect() calculateStyleAfterSaveCurrentWidthHeight = this.actions$
                                                            .ofType(PosCheckoutActions.ACTION_SAVE_GRID_WIDTH_HEIGHT)
                                                            .debounceTime(100)
                                                            .switchMap(() => {
                                                              return Observable.of({type: PosCheckoutActions.ACTION_CALCULATE_GRID_STYLE})
                                                                               .debounceTime(750);
                                                            });
  
  @Effect() resolveProductInGrid = this.actions$
                                       .ofType(
                                         PosCheckoutActions.ACTION_CALCULATE_GRID_STYLE,
                                         PosEntitiesActions.ACTION_FILTERED_PRODUCTS,
                                         PosCheckoutActions.ACTION_UPDATE_GRID_STATE
                                       )
                                       .withLatestFrom(this.store$.select('checkout'))
                                       .withLatestFrom(this.store$.select('entities'),
                                                       ([action, checkoutState], entitiesState) => [action, checkoutState, entitiesState])
                                       .withLatestFrom(this.store$.select('config'), (([action, checkoutState, entitiesState], configState) =>
                                         [action, checkoutState, entitiesState, configState]))
                                       .filter(([action, checkoutState, entitiesState, configState]) => {
                                         return checkoutState.productGridNumOfProductPerPage > 0 && entitiesState.products.itemFiltered.count() > 0;
                                       })
                                       .switchMap(([action, checkoutState, entitiesState, configState]) => {
                                         return Observable.fromPromise(this.checkoutService.resolveSearchProduct(checkoutState, entitiesState.products.itemFiltered, configState))
                                                          .map((data: GeneralMessage) => {
                                                            return {
                                                              type: PosCheckoutActions.ACTION_RESOLVE_GRID_PRODUCT, payload: data.data
                                                            };
                                                          });
                                       });
  
  @Effect() resolveCartCustomers = this.actions$
                                       .ofType(PosCheckoutActions.ACTION_SEARCH_CART_CUSTOMER)
                                       .withLatestFrom(this.store$.select('checkout'))
                                       .withLatestFrom(this.store$.select('entities'),
                                                       ([action, checkoutState], entitiesState) => [action, checkoutState, entitiesState])
                                       .withLatestFrom(this.store$.select('config'), (([action, checkoutState, entitiesState], configState) =>
                                         [action, checkoutState, entitiesState, configState]))
                                       .filter(([action, checkoutState, entitiesState, configState]) => _.isString(action.payload['cartCustomerSearchString']) && action.payload['cartCustomerSearchString'].length >= configState.constrain.minLengthSearching)
                                       .switchMap(([action, checkoutState, entitiesState, configState]) => {
                                         if (configState['posRetailConfig']['useCustomerOnlineMode'] === false) {
                                           return Observable.fromPromise(this.checkoutService.resolveSearchCustomer(checkoutState,  entitiesState[CustomerDB.getCode()]['items'], configState))
                                                            .map((data: GeneralMessage) => {
                                                              return {type: PosCheckoutActions.ACTION_RESOLVE_CART_CUSTOMERS, payload: data.data};
                                                            });
                                         }
                                       });
}
