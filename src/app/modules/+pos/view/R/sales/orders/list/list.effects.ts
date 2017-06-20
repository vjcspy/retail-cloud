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

@Injectable()
export class ListEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private listActions: ListActions) { }
  
  @Effect() resolveOrders = this.actions$
                                .ofType(
                                  PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                  ListActions.ACTION_CHANGE_SEARCH_DATA,
                                )
                                .filter((action) => !!action.payload['entityCode'] ? action.payload['entityCode'] === OrderDB.getCode() : true)
                                .withLatestFrom(this.store$.select('entities'))
                                .withLatestFrom(this.store$.select('orders'), (z, z1) => [...z, z1])
                                .withLatestFrom(this.store$.select('config'), (z, z1) => [...z, z1])
                                .map((z) => {
                                  const ordersState: OrdersState    = z[2];
                                  const configState: PosConfigState = z[3];
                                  const orders: List<OrderDB>       = (z[1] as PosEntitiesState).orders.items;
    
                                  let orderFiltered = orders.filter((order) => {
                                    if (ordersState.list.searchDateFrom.isAfter(moment(order['created_at']))) {
                                      return false;
                                    }
                                    if (ordersState.list.searchDateTo.isBefore(moment(order['created_at']))) {
                                      return false;
                                    }
      
                                    if (!!ordersState.list.searchOrderStatus) {
                                      if (order['retail_status'] !== ordersState.list.searchOrderStatus)
                                        return false;
                                    }
      
                                    if (!!ordersState.list.searchString) {
                                      //noinspection TypeScriptUnresolvedFunction
                                      let searchString = _.split(ordersState.list.searchString, " ");
        
                                      let reString = "";
                                      _.forEach(searchString, (v) => {
                                        if (!_.isString(v))
                                          return true;
                                        //noinspection TypeScriptUnresolvedFunction
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
                                      if (!re.test(orderStringData))
                                        return false;
                                    }
                                    return true;
                                  });
    
                                  //noinspection TypeScriptUnresolvedFunction
                                  orderFiltered    = orderFiltered.sortBy((o) => o['created_at']);
                                  let grouped      = orderFiltered.groupBy((o) => moment(o['created_at']).format("dddd, MMMM Do YYYY"));
                                  let ordersGroped = grouped.reduce((results, orders, timestamp) => {
                                    results = results.push({
                                                             timestamp: timestamp,
                                                             orders: orders,
                                                             today: moment().format('dddd, MMMM Do YYYY') === timestamp
                                                           });
                                    return results;
                                  }, List.of());
    
                                  return this.listActions.reslvedOrders(ordersGroped, false);
                                });
  
}
