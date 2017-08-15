import {Injectable} from '@angular/core';
import {ApiManager} from "../../../../../../../services/api-manager";
import {RequestService} from "../../../../../../../services/request";
import {ProgressBarService} from "../../../../../../share/provider/progess-bar";
import {List} from "immutable";
import {CustomerDB} from "../../../../../database/xretail/db/customer";
import {PosConfigState} from "../../../../../R/config/config.state";
import {GeneralMessage} from "../../../../../services/general/message";
import {PosGeneralState} from "../../../../../R/general/general.state";
import {CartCustomerState} from "./customer.state";
import * as _ from 'lodash';

@Injectable()
export class CartCustomerService {
  
  constructor(private apiManager: ApiManager, private request: RequestService, private progress: ProgressBarService) {}
  
  async resolveSearchCustomer(cartCustomerState: CartCustomerState, customers: List<CustomerDB>, configState: PosConfigState): Promise<GeneralMessage> {
    return new Promise((resolve, reject) => {
      let cartCustomers = List.of();
      if (_.isString(cartCustomerState.cartCustomerSearchString)) {
        let reString: string = "";
        _.forEach(cartCustomerState.cartCustomerSearchString.split(" "), (v) => {
          if (!_.isString(v)) {
            return true;
          }
          //noinspection TypeScriptUnresolvedFunction
          v = _.toLower(v);
          // escape regular expression special characters
          v = v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
          reString += ".*(" + v + "){1}";
        });
        reString += ".*";
        
        let _result = 0;
        customers.forEach((customer: CustomerDB) => {
          let re = new RegExp(reString, "gi");
          if (_result >= configState.posRetailConfig.numberOfSearchCustomerResult) {
            return false;
          }
          
          let fullStringSearch: string = "";
          _.forEach(configState.posRetailConfig.fieldSearchCustomer, (field: string) => {
            if (customer.hasOwnProperty(field) && _.isString(customer[field])) {
              fullStringSearch += " " + (customer[field]);
            }
          });
          //noinspection TypeScriptUnresolvedFunction
          if (re.test(fullStringSearch)) {
            ++_result;
            cartCustomers = cartCustomers.push(customer);
          }
        });
      } else {
        cartCustomers = <any>customers.take(configState.posRetailConfig.numberOfSearchCustomerResult);
      }
      return resolve({data: {cartCustomers}});
    });
  }
  
  async searchCustomerOnline(cartCustomerState: CartCustomerState, configState: PosConfigState, generalState: PosGeneralState): Promise<GeneralMessage> {
    return new Promise((resolve, reject) => {
      let _query = '';
      _query += `searchCriteria[currentPage]=1&searchCriteria[pageSize]=${configState.posRetailConfig.numberOfSearchCustomerResult}&searchCriteria[storeId]=${generalState.store['id']}&searchCriteria[searchFields]=${configState.posRetailConfig.fieldSearchCustomer.join(',')}&searchCriteria[searchValue]=${cartCustomerState.cartCustomerSearchString}&searchCriteria[searchOnline]=1`;
      let url    = this.apiManager.get("customers", generalState.baseUrl);
      url += url.indexOf('?') > -1 ? `&${_query}` : `?${_query}`;
      this.progress.start();
      this.request.makeGet(url)
          .subscribe((data) => {
            this.progress.done(true);
            let cartCustomers = List.of();
            _.forEach(data['items'], (c) => {
              cartCustomers = cartCustomers.push((new CustomerDB()).addData(c));
            });
            return resolve({data: {cartCustomers}});
          }, (e) => reject({isError: true, e}));
    });
  }
  
}
