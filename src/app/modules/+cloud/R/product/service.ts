import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import * as _ from 'lodash';

@Injectable()
export class ProductService {
  
  constructor() { }
  
  saveProduct(product): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('product.save_product', {product})
                      .subscribe((res) => {
                                   resolve(res);
                                 },
                                 (e) => {
                                   reject(e);
                                 });
    });
  }
  
  removeProduct(id): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('product.remove_product', {id})
                      .subscribe((res) => resolve(res), (e) => reject(e));
    });
  }
  
  isProductHasTrialPricing(product: Object, prices: any[]): boolean {
    let isHasTrial = false;
    if (_.isObject(product) && _.isArray(product['pricings'])) {
      _.forEach(product['pricings'], (pId) => {
        let price = _.find(prices, (_p) => _p['_id'] === pId);
        if (price && price['type'] === 'trial') {
          isHasTrial = true;
          
          return false;
        }
      });
    }
    return isHasTrial;
  }
  
  isProductCanPurchase(product: Object, prices: any[]): boolean {
    let canPurchase = false;
    if (_.isObject(product) && _.isArray(product['pricings'])) {
      _.forEach(product['pricings'], (pId) => {
        let price = _.find(prices, (_p) => _p['_id'] === pId);
        if (price && (price['type'] === 'life_time' || price['type'] === 'subscription')) {
          canPurchase = true;
          
          return false;
        }
      });
    }
    return canPurchase;
  }
}
