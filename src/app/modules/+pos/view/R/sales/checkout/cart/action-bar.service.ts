import {Injectable} from '@angular/core';
import {List} from "immutable";
import * as _ from 'lodash';
import {GeneralMessage} from "../../../../../services/general/message";
import {DatabaseManager} from "../../../../../../../services/database-manager";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {Quote} from "../../../../../core/framework/quote/Model/Quote";
import {NumberHelper} from "../../../../../services/helper/number-helper";
import {Timezone} from "../../../../../core/framework/General/DateTime/Timezone";
import {PosSyncService} from "../../../../../R/sync/sync.service";
import {Item} from "../../../../../core/framework/quote/Model/Quote/Item";

@Injectable()
export class CartActionBarService {
  
  constructor(private databaseManager: DatabaseManager,
              private posSyncService: PosSyncService) { }
  
  getOrderOnhold(): Promise<GeneralMessage> {
    return new Promise(async (resolve, reject) => {
      let db     = this.databaseManager.getDbInstance();
      let orders = await db.orderOnhold.toArray();
      orders     = <any>List.of(...orders);
      resolve({data: {orders}})
    });
  }
  
  handleSearchOrderOnhold(orders: List<any>, searchString: string = null) {
    if (searchString && _.isString(searchString)) {
      let arrStr           = searchString.split(' ');
      let reString: string = "";
      _.forEach(arrStr, (v) => {
        if (!_.isString(v))
          return true;
        //noinspection TypeScriptUnresolvedFunction
        v = _.toLower(v);
        // escape regular expression special characters
        v = v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        reString += ".*(" + v + "){1}";
      });
      reString += ".*";
      
      return orders.filter((order) => {
        let re = new RegExp(reString, "gi");
        
        let fullStringSearch = order['customer']['first_name'] +
                               order['customer']['last_name'] +
                               order['customer']['email'] +
                               (order['note'] ? order['note'] : '');
        
        return re.test(fullStringSearch);
      });
      
    } else {
      return orders;
    }
  }
  
  getOrderOnholdItems(items: any[]) {
    console.log(_.take(items, 2));
    return _.take(items, 2);
  }
  
  saveOnhold(posQuoteState: PosQuoteState): Promise<GeneralMessage> {
    return new Promise(async (resolve, reject) => {
      try {
        const quote: Quote = posQuoteState.quote;
        
        let db = this.databaseManager.getDbInstance();
        
        await db.orderOnhold.bulkAdd([<any>{
          customer: quote.getCustomer(),
          current_shipping: quote.getShippingAddress().toJS(),
          current_billing: quote.getBillingAddress().toJS(),
          note: quote.getData('retail_note'),
          items: this.posSyncService.prepareOrderItem(quote.getShippingAddress().getItems()),
          shipping_amount: posQuoteState.shippingAmount,
          data: {
            whole_order_discount: {
              'value': quote.getData('discount_whole_order'),
              'isPercentMode': quote.getData('is_percent_discount_whole_order')
            },
            coupon: {
              code: quote.getData('coupon_code')
            }
          },
          grand_total: NumberHelper.round(quote.getShippingAddress().getGrandTotal()),
          create_at: Timezone.getCurrentStringTime()
        }]);
        
        resolve();
      }
      catch (e) {
        console.log('add order onhold failed');
        
        return reject({e, isError: true});
      }
    });
  }
  
  
}
