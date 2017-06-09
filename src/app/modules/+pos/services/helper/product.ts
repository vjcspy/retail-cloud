import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {TaxClassDB} from "../../database/xretail/db/tax-class";
import {List} from "immutable";

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
  
  getProductTaxClass(tax_class_id: number, taxClass: List<TaxClassDB>): string {
    if (tax_class_id == 0) {
      return "NONE";
    } else {
      let _taxClass = taxClass.find((t) => parseInt(t.id) === parseInt(tax_class_id + "") && t.type === 'PRODUCT');
      if (_taxClass) {
        return _taxClass.name;
      }
      else {
        return "NONE";
      }
    }
  }
}
