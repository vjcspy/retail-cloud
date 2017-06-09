import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs";
import {CartCustomerActions} from "./customer.actions";
import {CustomerDB} from "../../../../../database/xretail/db/customer";
import {CartCustomerService} from "./customer.service";
import {GeneralMessage} from "../../../../../services/general/message";
import * as _ from 'lodash';

@Injectable()
export class CartCustomEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private cartCustomerService: CartCustomerService) { }
  
  @Effect() resolveCartCustomers = this.actions$
                                       .ofType(CartCustomerActions.ACTION_SEARCH_CART_CUSTOMER)
                                       .withLatestFrom(this.store$.select('cartCustomer'))
                                       .withLatestFrom(this.store$.select('entities'),
                                                       ([action, cartCustomerState], entitiesState) => [action, cartCustomerState, entitiesState])
                                       .withLatestFrom(this.store$.select('config'), (([action, cartCustomerState, entitiesState], configState) =>
                                         [action, cartCustomerState, entitiesState, configState]))
                                       .withLatestFrom(this.store$.select('general'), (([action, cartCustomerState, entitiesState, configState], generalState) =>
                                         [action, cartCustomerState, entitiesState, configState, generalState]))
                                       .filter(([action, cartCustomerState, entitiesState, configState]) => _.isString(action.payload['cartCustomerSearchString']) && action.payload['cartCustomerSearchString'].length >= configState.constrain.minLengthSearching)
                                       .switchMap(([action, cartCustomerState, entitiesState, configState, generalState]) => {
                                         if (configState.posRetailConfig.useCustomerOnlineMode === false) {
                                           return Observable.fromPromise(this.cartCustomerService.resolveSearchCustomer(cartCustomerState, entitiesState[CustomerDB.getCode()]['items'], configState))
                                                            .map((data: GeneralMessage) => {
                                                              return {type: CartCustomerActions.ACTION_RESOLVE_CART_CUSTOMERS, payload: data.data};
                                                            });
                                         } else {
                                           return Observable.fromPromise(this.cartCustomerService.searchCustomerOnline(cartCustomerState, configState, generalState))
                                                            .map((data) => {
                                                              return {type: CartCustomerActions.ACTION_RESOLVE_CART_CUSTOMERS, payload: data.data};
                                                            });
                                         }
                                       });
}
