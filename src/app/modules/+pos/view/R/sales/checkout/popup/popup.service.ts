import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {ProductDB} from "../../../../../database/xretail/db/product";
import {List} from "immutable";
import * as _ from 'lodash';

@Injectable()
export class CheckoutPopupService {
  
  constructor(private store$: Store<any>) { }

    prepareWishlistItem(wishlist:any[], products:List<ProductDB>) {
        let wishlistItems = List.of();
        _.forEach(wishlist, (item) => {
                      let canAddToQuote = false;
                      let _item         = Object.assign({}, {...item});
                      if (item['buyRequest'] && item['product_id']) {
                          let product    = products.find((p) => parseInt(p['id'] + '') === parseInt(item['product_id']));
                          let buyRequest = item['buyRequest'];
                          if (product) {
                              if (product.hasOwnProperty('type_id') && product['type_id'] === "bundle") {
                                  if (buyRequest.hasOwnProperty('bundle_option')) {
                                      canAddToQuote = true;
                                  }
                              } else if (product.hasOwnProperty('type_id') && product['type_id'] === "grouped") {
                                  if (buyRequest.hasOwnProperty('super_group')) {
                                      _item['associatedProducts'] = [];
                                      let totalqty = 0;
                                      _.forEach(buyRequest['super_group'], async(qty, productId) => {
                                          totalqty += qty;
                                          let _childProduct = products.find((p) => parseInt(p['id'] + '') === parseInt(productId));
                                          _item['associatedProducts'].push(_childProduct);
                                      });
                                      // nếu tổng số lượng sp con trong group product = 0 -> disable product when add to cart.
                                      if (totalqty > 0) {
                                          canAddToQuote = true;
                                      }
                                  }
                              } else {
                                  canAddToQuote = true;
                              }
                              _item['product'] = product;
                          }
                      }
                      wishlistItems = wishlistItems.push(Object.assign(_item, {canAddToQuote}));
                  });
        return wishlistItems;
    }
}
