import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs";
import {CartCustomerActions} from "./customer.actions";
import {CustomerDB} from "../../../../../database/xretail/db/customer";
import {CartCustomerService} from "./customer.service";
import {GeneralMessage} from "../../../../../services/general/message";
import * as _ from 'lodash';
import {PosConfigState} from "../../../../../R/config/config.state";
import {CartCustomerState} from "./customer.state";
import {Router} from "@angular/router";
import {RealtimeActions} from "../../../../../R/entities/realtime/realtime.actions";

@Injectable()
export class CartCustomEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private cartCustomerService: CartCustomerService, private router: Router) { }
  
  @Effect() resolveCartCustomers = this.actions$
                                       .ofType(
                                         CartCustomerActions.ACTION_SEARCH_CART_CUSTOMER,
                                         RealtimeActions.ACTION_REALTIME_UPDATED_ENTITY_DB,
                                         CartCustomerActions.ACTION_UPDATE_ACTION_CART_STATE
                                       )
                                       .filter(() => this.router.isActive('/pos/default/sales/checkout', false))
                                       .filter((action) => !!action.payload['entityCode'] ?
                                         action.payload['entityCode'] === CustomerDB.getCode() : true)
                                       .withLatestFrom(this.store$.select('cartCustomer'))
                                       .withLatestFrom(this.store$.select('entities'),
                                                       ([action, cartCustomerState], entitiesState) => [action, cartCustomerState, entitiesState])
                                       .withLatestFrom(this.store$.select('config'), (([action, cartCustomerState, entitiesState], configState) =>
                                         [action, cartCustomerState, entitiesState, configState]))
                                       .withLatestFrom(this.store$.select('general'), (([action, cartCustomerState, entitiesState, configState], generalState) =>
                                         [action, cartCustomerState, entitiesState, configState, generalState]))
                                       .filter(([action, cartCustomerState, entitiesState, configState]) => {
                                         if ((configState as PosConfigState).posRetailConfig.useCustomerOnlineMode) {
                                           return _.isString((cartCustomerState as CartCustomerState).cartCustomerSearchString) && (cartCustomerState as CartCustomerState).cartCustomerSearchString.length >= (configState as any).constrain.minLengthSearching;
                                         } else {
                                           return (cartCustomerState as CartCustomerState).inSearchCustomers === true;
                                         }
                                       })
                                       .switchMap(([action, cartCustomerState, entitiesState, configState, generalState]) => {
                                         if ((configState as PosConfigState).posRetailConfig.useCustomerOnlineMode === false) {
                                           return Observable.fromPromise(this.cartCustomerService.resolveSearchCustomer(<any>cartCustomerState, entitiesState[CustomerDB.getCode()]['items'], <any>configState))
                                                            .map((data: GeneralMessage) => {
                                                              return {type: CartCustomerActions.ACTION_RESOLVE_CART_CUSTOMERS, payload: data.data};
                                                            });
                                         } else {
                                           return Observable.fromPromise(this.cartCustomerService.searchCustomerOnline(<any>cartCustomerState, <any>configState, <any>generalState))
                                                            .map((data) => {
                                                              return {type: CartCustomerActions.ACTION_RESOLVE_CART_CUSTOMERS, payload: data.data};
                                                            });
                                         }
                                       });
}
