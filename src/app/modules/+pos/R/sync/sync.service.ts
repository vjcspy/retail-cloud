import {Injectable} from '@angular/core';
import {PosGeneralState} from "../general/general.state";
import {OfflineService} from "../../../share/provider/offline";
import * as _ from 'lodash';
import {PosQuoteState} from "../quote/quote.state";
import {PosOrderSync} from "./sync.state";
import {RequestService} from "../../../../services/request";
import {ApiManager} from "../../../../services/api-manager";
import {Observable} from "rxjs";

@Injectable()
export class PosSyncService {
  
  constructor(private onlineOffline: OfflineService, private requestService: RequestService, private apiManager: ApiManager) { }
  
  prepareOrder(quoteState: PosQuoteState, generalState: PosGeneralState): PosOrderSync {
    const quote = quoteState.quote;
    let order   = {};
    
    order['outlet_id']           = generalState.outlet['id'];
    order['register_id']         = generalState.register['id'];
    order['retail_note']         = quote.getData('retail_note');
    order['user_id']             = generalState.user['id'];
    order['retail_has_shipment'] = quote.getData('retail_has_shipment');
    order['is_offline']          = !this.onlineOffline.online;
    
    order['items'] = [];
    _.forEach(quoteState.items.toArray(), (item) => {
      order['items'].push(Object.assign({}, {...item}, {product: null}));
    });
    
    order['account']              = {
      'group_id': quote.getCustomer().getCustomerGroupId(),
      'email': quote.getCustomer().getData('email')
    };
    order['customer_id']          = quote.getCustomer().getId();
    order['store_id']             = generalState.store['id'];
    order['order']                = {
      'billing_address': quote.getShippingAddress().toJS(),
      'shipping_address': quote.getBillingAddress().toJS(),
      'payment_method': 'retailmultiple',
      'shipping_method': 'retailshipping_retailshipping',
      'shipping_amount': quoteState.shippingAmount
    };
    order['retail_addition_data'] = quote.getRetailAdditionData();
    if (quote.getData('coupon_code')) {
      order['order'] ['coupon'] = {
        'code': quote.getData('coupon_code')
      };
    }
    if (quote.getData('discount_whole_order')) {
      order['order']['whole_order_discount'] = {
        'value': quote.getData('discount_whole_order'),
        'isPercentMode': !quote.getData('is_value_discount_whole_order')
      }
    }
    if (quote.getData('payment_data')) {
      order['order']['payment_data'] = quote.getData('payment_data');
    }
    if (quote.getData('is_exchange')) {
      order['order']['is_exchange'] = quote.getData('is_exchange');
    }
    
    if (quote.getData("reward_point")) {
      order['reward_point'] = quote.getData("reward_point");
    }
    
    return <any>order;
  }
  
  syncOrderOnline(orderData: Object, generalState: PosGeneralState): Observable<any> {
    return this.requestService.makePost(this.apiManager.get('loadOrderData', generalState.baseUrl), orderData);
  }
  
}
