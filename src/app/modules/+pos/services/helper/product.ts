import {Injectable} from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class ProductHelper {
  
  isSales(product: Object) {
    return product['special_price'] != null || !_.isEmpty(product['tier_prices']);
  }
  
  isOutOfStock(product: Object) {
    return !this.isSalesAble(product);
  }
  
  isSalesAble(product: Object) {
    // FIX XRT-666 : out of stock chỉ check theo setting product chứ không check theo qty
    return !(product['stock_items'] && // apply on both Configurable/Bundle/Grouped parent product
             (parseInt(product['stock_items']['is_in_stock']) === 0));
  }
}
