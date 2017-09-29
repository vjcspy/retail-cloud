import {Injectable} from '@angular/core';
import {List} from "immutable";
import {PosConfigState} from "../../../../../R/config/config.state";
import {GeneralMessage} from "../../../../../services/general/message";
import {PriceFormatPipe} from "../../../../pipes/price-format";
import {ProductDB} from "../../../../../database/xretail/db/product";
import {StringHelper} from "../../../../../services/helper/string-helper";
import * as _ from 'lodash';
import {CheckoutProductState} from "./product.state";

@Injectable()
export class CheckoutProductService {
  private _handleScanner;
  private _luckySearchSuccessElem: any;
  
  resolveCatalogProduct(checkoutProductsState: CheckoutProductState, products: List<any>): Promise<GeneralMessage> {
    return new Promise((resolve) => {
      let catalogProducts = products;
      
      if (!!checkoutProductsState.currentCategory
          && parseInt(checkoutProductsState.currentCategory['level']) > 1
          && _.isArray(checkoutProductsState.currentCategory['product_ids'])) {
        const productAllow = checkoutProductsState.currentCategory['product_ids'];
        catalogProducts    = <any> (products.filter((p) => _.indexOf(productAllow, p['id']) > -1));
      }
      
      return resolve({data: {catalogProducts}});
    });
  }
  
  async resolveSearchProduct(checkoutProductsState: CheckoutProductState, products: List<any>, config: PosConfigState): Promise<GeneralMessage> {
    return new Promise((resolve) => {
      let totalsPage: number;
      let totalsProduct: number;
      let currentPage: number;
      let productGridProducts: List<any> = List.of();
      
      if (!_.isEmpty(checkoutProductsState.searchString) && !!checkoutProductsState.searchString) {
        totalsPage           = 0;
        currentPage          = 1;
        let reString: string = "";
        _.forEach(checkoutProductsState.searchString.split(" "), (v) => {
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
          if (work >= config.posRetailConfig.numberOfSearchProductResult) {
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
              
              fullStringSearch += " " + product['addition_search_fields'];
            }
          });
          //noinspection TypeScriptUnresolvedFunction
          if (re.test(fullStringSearch)) {
            ++work;
            productGridProducts = <any> productGridProducts.push(product);
          }
        });
        totalsProduct = productGridProducts.count();
      } else {
        currentPage = checkoutProductsState.productGridCurrentPage;
        // OLD UI
        // let _offset = (currentPage - 1) * checkoutProductsState.productGridNumOfProductPerPage;
        // if (checkoutProductsState.isGridMode) {
        //   let _totals         = products.count();
        //   totalsPage          = Math.ceil(_totals / checkoutProductsState.productGridNumOfProductPerPage);
        //   //noinspection TypeScriptUnresolvedFunction
        //   productGridProducts = <any> (products.slice(_offset, _offset + checkoutProductsState.productGridNumOfProductPerPage));
        // } else {
        //   totalsPage          = 0;
        //   currentPage         = 1;
        //   productGridProducts = <any> (products.take(checkoutProductsState.productGridNumOfProductPerPage));
        // }
        
        // NEW UI
        totalsProduct       = products.count();
        totalsPage          = Math.ceil(products.count() / checkoutProductsState.productGridNumOfProductPerPage);
        productGridProducts = <any> (products.take((currentPage + checkoutProductsState.bufferPageView) * checkoutProductsState.productGridNumOfProductPerPage));
      }
      
      return resolve({data: {totalsPage, currentPage, productGridProducts, totalsProduct}});
    });
  }
  
  handleScanner(callback: (barcode: string) => void, forceChange: boolean = false) {
    if (typeof this._handleScanner === 'undefined' || forceChange) {
      console.log('init handle scanner');
      this._handleScanner = $(document)['scannerDetection']({
                                                              timeBeforeScanTest: 200, // wait for the next character for upto 200ms
                                                              endChar: [13], // be sure the scan is complete if key 13 (enter) is detected
                                                              avgTimeByChar: 80, // it's not a barcode if a character takes longer than 40ms
                                                              onComplete: (barcode, qty) => {
                                                                callback(barcode);
                                                              } // main callback function
                                                            });
    }
  }
  
  disableHandleScanner() {
    console.log('destroy scanner handle');
    $(document)["scannerDetection"](false);
  }
  
  playSuccessLuckySearch() {
    if (typeof this._luckySearchSuccessElem === 'undefined') {
      this._luckySearchSuccessElem = document.getElementById("luckySearchSuccess");
    }
    
    this._luckySearchSuccessElem.play();
  }
}
