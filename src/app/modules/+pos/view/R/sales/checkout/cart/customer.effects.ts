import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs";
import {CartCustomerActions} from "./customer.actions";
import {CustomerDB} from "../../../../../database/xretail/db/customer";

@Injectable()
export class CartCustomEffects {
  
  constructor(private store$: Store<any>,private actions$:Actions) { }
  
  @Effect() resolveCartCustomers = this.actions$
                                       .ofType(CartCustomerActions.ACTION_SEARCH_CART_CUSTOMER)
                                       .withLatestFrom(this.store$.select('checkout'))
                                       .withLatestFrom(this.store$.select('entities'),
                                                       ([action, checkoutState], entitiesState) => [action, checkoutState, entitiesState])
                                       .withLatestFrom(this.store$.select('config'), (([action, checkoutState, entitiesState], configState) =>
                                         [action, checkoutState, entitiesState, configState]))
                                       .withLatestFrom(this.store$.select('general'), (([action, checkoutState, entitiesState, configState], generalState) =>
                                         [action, checkoutState, entitiesState, configState, generalState]))
                                       .filter(([action, checkoutState, entitiesState, configState]) => _.isString(action.payload['cartCustomerSearchString']) && action.payload['cartCustomerSearchString'].length >= configState.constrain.minLengthSearching)
                                       .switchMap(([action, checkoutState, entitiesState, configState, generalState]) => {
                                         if (configState.posRetailConfig.useCustomerOnlineMode === false) {
                                           return Observable.fromPromise(this.checkoutService.resolveSearchCustomer(checkoutState, entitiesState[CustomerDB.getCode()]['items'], configState))
                                                            .map((data: GeneralMessage) => {
                                                              return {type: PosCheckoutActions.ACTION_RESOLVE_CART_CUSTOMERS, payload: data.data};
                                                            });
                                         } else {
                                           return Observable.fromPromise(this.checkoutService.searchCustomerOnline(checkoutState, configState, generalState))
                                                            .map((data) => {
                                                              return {type: PosCheckoutActions.ACTION_RESOLVE_CART_CUSTOMERS, payload: data.data};
                                                            });
                                         }
                                       });
}
