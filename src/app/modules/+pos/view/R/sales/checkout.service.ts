import {Injectable} from '@angular/core';
import {CheckoutState} from "./checkout.state";
import {GeneralMessage} from "../../../services/general/message";
import * as _ from 'lodash';
import {PriceFormatPipe} from "../../../pipes/price-format";
import {ProductDB} from "../../../database/xretail/db/product";
import {PosConfigState} from "../../../R/config/config.state";
import {StringHelper} from "../../../services/helper/string-helper";
import {List} from "immutable";
import {CustomerDB} from "../../../database/xretail/db/customer";

@Injectable()
export class PosCheckoutService {
  
  async resolveSearchProduct(checkoutState: CheckoutState, products: List<any>, config: PosConfigState): Promise<GeneralMessage> {
    return new Promise((resolve, reject) => {
      // integrate with category
      if (!!checkoutState.currentCategory
          && parseInt(checkoutState.currentCategory['level']) > 1
          && _.isArray(checkoutState.currentCategory['product_ids'])) {
        const productAllow = checkoutState.currentCategory['product_ids'];
        products           = <any> (products.filter((p) => _.indexOf(productAllow, p['id']) > -1));
      }
      
      let totalsPage: number;
      let currentPage: number;
      let productGridProducts: List<any> = List.of();
      
      if (!_.isEmpty(checkoutState.searchString) && !!checkoutState.searchString) {
        totalsPage           = 0;
        currentPage          = 1;
        let reString: string = "";
        _.forEach(checkoutState.searchString.split(" "), (v) => {
          if (!_.isString(v) || v === '' || v === null) {
            return true;
          }
          //noinspection TypeScriptUnresolvedFunction
          v = _.toLower(v);
          
          // escape regular expression special characters
          // FIx xrt 90: search product by price
          v = v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace('\\,', '');
          
          reString += ".*(" + v + "){1}";
        });
        
        reString += ".*";
        
        let work = 0;
        
        let _priceFormat = new PriceFormatPipe();
        products.forEach((product: ProductDB) => {
          let re = new RegExp(reString, "gi");
          if (work >= checkoutState.productGridNumOfProductPerPage) {
            return false;
          }
          
          let fullStringSearch: string = "";
          _.forEach(config.posRetailConfig['fieldSearchProduct'], (field: string) => {
            if (product.hasOwnProperty(field) && _.isString(product[field])) {
              if (field === 'price') {
                // Search theo giá converted
                fullStringSearch += " " + (_priceFormat.transform(product[field], true) as any).replace(',', '');
                // fullStringSearch += " " + product[field];
              } else {
                if (config.constrain['supportUnicodeInSearch']) {
                  fullStringSearch += " " + StringHelper.removeDiacritics(product[field]);
                } else {
                  fullStringSearch += " " + product[field];
                }
              }
            }
          });
          //noinspection TypeScriptUnresolvedFunction
          if (re.test(fullStringSearch)) {
            ++work;
            productGridProducts = <any> productGridProducts.push(product);
          }
        });
      } else {
        currentPage = checkoutState.productGridCurrentPage;
        let _offset = (currentPage - 1) * checkoutState.productGridNumOfProductPerPage;
        if (checkoutState.isGridMode) {
          let _totals         = products.count();
          totalsPage          = Math.ceil(_totals / checkoutState.productGridNumOfProductPerPage);
          //noinspection TypeScriptUnresolvedFunction
          productGridProducts = <any> (products.slice(_offset, _offset + checkoutState.productGridNumOfProductPerPage));
        } else {
          totalsPage          = 0;
          currentPage         = 1;
          productGridProducts = <any> (products.take(checkoutState.productGridNumOfProductPerPage));
        }
      }
      
      return resolve({data: {totalsPage, currentPage, productGridProducts}});
    });
  }
  
  async resolveSearchCustomer(checkoutState: CheckoutState, customers: List<CustomerDB>, configState: PosConfigState): Promise<GeneralMessage> {
    return new Promise((resolve, reject) => {
      let cartCustomers = List.of();
      if (_.isString(checkoutState.cartCustomerSearchString)) {
        let reString: string = "";
        _.forEach(checkoutState.cartCustomerSearchString.split(" "), (v) => {
          if (!_.isString(v))
            return true;
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
          if (_result > configState.posRetailConfig.numberOfSearchCustomerResult)
            return false;
          
          let fullStringSearch: string = "";
          _.forEach(configState.posRetailConfig.fieldSearchCustomer, (field: string) => {
            if (customer.hasOwnProperty(field) && _.isString(customer[field]))
              fullStringSearch += " " + (customer[field]);
          });
          //noinspection TypeScriptUnresolvedFunction
          if (re.test(fullStringSearch)) {
            ++_result;
            cartCustomers = cartCustomers.push(customer);
          }
        });
      }
      return resolve({data: {cartCustomers}})
    });
  }
}
