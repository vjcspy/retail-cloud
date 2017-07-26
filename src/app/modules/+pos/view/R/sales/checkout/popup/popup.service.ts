import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {ProductDB} from "../../../../../database/xretail/db/product";
import {List} from "immutable";
import * as _ from 'lodash';

@Injectable()
export class CheckoutPopupService {
  
  constructor(private store$: Store<any>) { }
  
  prepareWishlistItem(wishlist: any[], products: List<ProductDB>) {
    let wishlistItems = List.of();
    _.forEach(wishlist, (item) => {
                let canAddToQuote = false;
                let _item         = Object.assign({}, {...item});
                if (item['buyRequest'] && item['buyRequest']['product_id']) {
                  let product = products.find((p) => parseInt(p['id'] + '') === parseInt(item['buyRequest']['product_id']));
                  if (product) {
                    canAddToQuote  = true;
                    _item['name']  = product['name'];
                    _item['price'] = product['price'];
                  }
                }
                wishlistItems = wishlistItems.push(Object.assign(_item, {canAddToQuote}));
              }
    );
    
    return wishlistItems;
  }
}
