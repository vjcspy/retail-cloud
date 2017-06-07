import {Injectable} from '@angular/core';
import {Quote} from "../../core/framework/quote/Model/Quote";
import {Customer} from "../../core/framework/customer/Model/Customer";
import {PosQuote} from "./quote";
import {RequestService} from "../../../../services/request";
import {ApiManager} from "../../../../services/api-manager";
import {PosGeneralState} from "../general/general.state";
import {Observable} from "rxjs";
import * as _ from 'lodash';
import {Address} from "../../core/framework/quote/Model/Quote/Address";
import {PosConfigState} from "../config/config.state";
import {config} from "shelljs";
import {GeneralException} from "../../core/framework/General/Exception/GeneralException";
import {Outlet} from "../../core/framework/outlet/Model/Outlet";

@Injectable()
export class PosQuoteService {
  
  constructor(private request: RequestService, private apiManger: ApiManager) {}
  
  setCustomerToQuote(customer: Customer): Quote {
    const quote = PosQuote.getQuote();
    quote.setData('use_default_customer', customer.getData('is_default_customer'))
         .getCustomerSession()
         .setCustomer(customer)
         .setCustomerGroupId(customer.getCustomerGroupId());
    
    return quote;
  }
  
  checkShiftOpenInSV(generalState: PosGeneralState): Observable<any> {
    return this.request
               .makeGet(this.apiManger.get('check-open-shift', generalState.baseUrl) + `?outlet_id=${generalState.outlet['id']}&register_id=${generalState.register['id']}`)
  }
  
  getDefaultAddressOfCustomer(customer: Customer, outlet: Object) {
    let shippingAdd = new Address();
    let billingAdd  = new Address();
    if (customer.hasOwnProperty('default_billing') && customer['default_billing']) {
      const _billingAdd = _.find(customer.address, (add) => add['id'] == customer['default_billing']);
      if (_billingAdd) {
        Object.assign(billingAdd, _billingAdd);
      }
    } else {
      Object.assign(billingAdd, Outlet.getAddress(outlet));
    }
    
    if (customer.hasOwnProperty('default_shipping') && customer['default_shipping']) {
      const _shippingAdd = _.find(customer.address, (add) => add['id'] == customer['default_shipping']);
      if (_shippingAdd) {
        Object.assign(shippingAdd, _shippingAdd);
      }
    } else {
      Object.assign(shippingAdd, Outlet.getAddress(outlet));
    }
    return {shippingAdd, billingAdd};
  }
  
}
