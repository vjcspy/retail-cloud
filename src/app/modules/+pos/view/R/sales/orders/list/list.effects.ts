import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosEntitiesActions} from "../../../../../R/entities/entities.actions";
import {OrderDB} from "../../../../../database/xretail/db/order";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {List} from "immutable";
import {OrdersState} from "../order.state";
import * as moment from 'moment';
import * as _ from 'lodash';
import {PosConfigState} from "../../../../../R/config/config.state";
import {ListActions} from "./list.actions";
import {ListService} from "./list.service";
import {PosGeneralState} from "../../../../../R/general/general.state";
import {Observable} from "rxjs";
import {RealtimeActions} from "../../../../../R/entities/realtime/realtime.actions";
import {ProgressBarService} from "../../../../../../share/provider/progess-bar";
import {Router} from "@angular/router";
import {PosSyncActions} from "../../../../../R/sync/sync.actions";
import {EntityActions} from "../../../../../R/entities/entity/entity.actions";

@Injectable()
export class ListEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private listActions: ListActions,
              private listService: ListService,
              private progressBar: ProgressBarService,
              private router: Router) { }
  
  @Effect() resolveOrders = this.actions$
                                .ofType(
                                  PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                  ListActions.ACTION_CHANGE_SEARCH_DATA,
                                  RealtimeActions.ACTION_REALTIME_UPDATED_ENTITY_DB,
                                  EntityActions.ACTION_PUSH_ENTITY,
                                  PosSyncActions.ACTION_SYNCED_OFFLINE_ORDER
                                )
                                .filter(() => this.router.isActive('/pos/default/sales/orders', false))
                                .filter((action) => !!action.payload['entityCode'] ? action.payload['entityCode'] === OrderDB.getCode() : true)
                                .withLatestFrom(this.store$.select('entities'))
                                .withLatestFrom(this.store$.select('orders'), (z, z1) => [...z, z1])
                                .withLatestFrom(this.store$.select('config'), (z, z1) => [...z, z1])
                                .filter((z) => !(z[2] as OrdersState).list.isSearchOnline)
                                .map((z) => {
                                  const ordersState: OrdersState    = <any>z[2];
                                  const configState: PosConfigState = <any>z[3];
                                  const orders: List<OrderDB>       = (z[1] as PosEntitiesState).orders.items;
    
                                  let orderFiltered = orders.filter((order) => {
                                    if (ordersState.list.searchDateFrom.isAfter(moment(new Date(order['created_at'])))) {
                                      return false;
                                    }
                                    if (ordersState.list.searchDateTo.isBefore(moment(new Date(order['created_at'])))) {
                                      return false;
                                    }
      
                                    if (_.isString(order['retail_status'])) {
                                      if (!!ordersState.list.searchOrderPaymentStatus) {
                                        if (parseInt(order['retail_status'].slice(0, 1)) !== parseInt(ordersState.list.searchOrderPaymentStatus)) {
                                          return false;
                                        }
                                      }
                                      if (!!ordersState.list.searchOrderShipmentStatus) {
                                        if (parseInt(order['retail_status'].slice(-1)) !== parseInt(ordersState.list.searchOrderShipmentStatus)) {
                                          return false;
                                        }
                                      }
                                    }
      
                                    if (ordersState.list.searchOrderSyncStatus !== null && ordersState.list.searchOrderSyncStatus !== '') {
                                      if (parseInt(ordersState.list.searchOrderSyncStatus) === 1 && order.hasOwnProperty('pushed') && parseInt(order['pushed'] + '') !== parseInt(ordersState.list.searchOrderSyncStatus)) {
                                        return false;
                                      } else if (parseInt(ordersState.list.searchOrderSyncStatus) !== 1 && parseInt(order['pushed'] + '') !== parseInt(ordersState.list.searchOrderSyncStatus)) {
                                        return false;
                                      }
                                    }
      
                                    if (!!ordersState.list.searchString) {
                                      //noinspection TypeScriptUnresolvedFunction
                                      let searchString = _.split(ordersState.list.searchString, " ");
        
                                      let reString = "";
                                      _.forEach(searchString, (v) => {
                                        if (!_.isString(v)) {
                                          return true;
                                        }
                                        v = _.toLower(v);
                                        // escape regular expression special characters
                                        v = v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                                        reString += ".*(" + v + "){1}";
                                      });
                                      reString += ".*";
                                      let re                      = new RegExp(reString, "gi");
                                      let orderStringData: string = "";
                                      _.forEach(configState.posRetailConfig.fieldSearchOrderOffline, (field: string) => {
                                        switch (field) {
                                          case 'telephone':
                                            orderStringData += " " + order['billing_address']['telephone'] + " " +
                                                               order['shipping_address']['telephone'] + " " +
                                                               (order['customer']['phone'] ? order['customer']['phone'] : "");
                                            break;
                                          case 'client_order_id':
                                            orderStringData += "#" + order['retail_id'];
                                            break;
                                          case 'magento_order_id':
                                            orderStringData += "#" + order['increment_id'];
                                            break;
                                          case 'email':
                                            orderStringData += " " + order['customer']['email'];
                                            break;
                                          case 'first_name' || 'last_name':
                                            orderStringData += " " + order['customer']['name'];
                                            break;
                                          case 'customer_id':
                                            orderStringData += " " + order['customer']['id'];
                                            break;
                                          default:
                                            break;
                                        }
                                      });
                                      if (!re.test(orderStringData)) {
                                        return false;
                                      }
                                    }
                                    return true;
                                  });
    
                                  let ordersSorted = orderFiltered.sort(
                                    (a, b) => -a['created_at'].localeCompare(b['created_at'])
                                  );
                                  let grouped      = ordersSorted.groupBy((o) => moment(new Date(o['created_at'])).format("dddd, MMMM Do YYYY"));
                                  let ordersGroped = grouped.reduce((results, _orders, _timestamp) => {
                                    results = results.push({
                                                             timestamp: _timestamp,
                                                             orders: _orders,
                                                             today: moment().format('dddd, MMMM Do YYYY') === _timestamp
                                                           });
                                    return results;
                                  }, List.of());
    
                                  return this.listActions.reslvedOrders(ordersGroped, false);
                                });
  
  @Effect() resolveOrdersOnline = this.actions$
                                      .ofType(
                                        ListActions.ACTION_CHANGE_SEARCH_DATA,
                                      )
                                      .withLatestFrom(this.store$.select('orders'))
                                      .withLatestFrom(this.store$.select('general'), (z, z1) => [...z, z1])
                                      .filter((z) => (z[1] as OrdersState).list.isSearchOnline)
                                      // .filter((z) => {
                                      //   return !!(z[1] as OrdersState).list.searchString;
                                      // })
                                      .switchMap((z) => {
                                        const ordersState: OrdersState      = <any>z[1];
                                        const generalState: PosGeneralState = <any>z[2];
                                        this.progressBar.start();
                                        return this.listService
                                                   .createRequestSearchOrder(ordersState.list.searchString, ordersState.list.searchDateFrom.format("YYYY-MM-DD"), ordersState.list.searchDateTo.format("YYYY-MM-DD"), parseInt(ordersState.list.searchOrderSyncStatus) === 3, generalState)
                                                   .map((data) => {
                                                     if (data.hasOwnProperty('items')) {
                                                       let orders = List.of();
                                                       _.forEach(data['items'], (order) => {
                                                         order['id'] = order['order_id'];
                                                         orders      = orders.push(order);
                                                       });
                                                       let ordersSorted = orders.sort(
                                                         (a, b) => -a['created_at'].localeCompare(b['created_at'])
                                                       );
        
                                                       let group = ordersSorted.groupBy((o) => moment(new Date(o['created_at']))
                                                         .format("dddd, MMMM Do YYYY"));
        
                                                       let ordersGroped = group.reduce((results, _orders, _timestamp) => {
                                                         results = results.push({
                                                                                  timestamp: _timestamp,
                                                                                  orders: _orders,
                                                                                  today: moment().format('dddd, MMMM Do YYYY') === _timestamp
                                                                                });
                                                         return results;
                                                       }, List.of());
        
                                                       return this.listActions.reslvedOrders(ordersGroped, false);
                                                     }
                                                   })
                                                   .catch((e) => Observable.of(this.listActions.searchOnlineFailed(e, false)))
                                                   .finally(() => this.progressBar.done(true));
    
                                      });
}
