import {Price as SimplePrice} from "../../../catalog/Model/Product/Type/Price";
import {Product} from "../../../catalog/Model/Product";
import * as _ from "lodash";
import {EventManager} from "../../../General/Event/EventManager";
import {ObjectManager} from "../../../General/App/ObjectManager";
import {Timezone} from "../../../General/DateTime/Timezone";
import {GeneralException} from "../../../General/Exception/GeneralException";
import {Bundle} from "./Type";
import {GroupManagement} from "../../../customer/Model/GroupManagement";
export class Price extends SimplePrice {
  /**
   * Fixed bundle price type
   */
  static PRICE_TYPE_FIXED = 1;
  
  /**
   * Dynamic bundle price type
   */
  static PRICE_TYPE_DYNAMIC = 0;
  
  getPrice(product: Product): number {
    if (product.getPriceType() == Price.PRICE_TYPE_FIXED) {
      return product.getData('price');
    } else {
      return 0;
    }
  }
  
  getFinalPrice(qty: number, product: Product): number {
    if (qty == null && product.getData('calculated_final_price') != null) {
      return product.getData("calculated_final_price");
    }
    
    let finalPrice = this.getBasePrice(product, qty);
    product.setFinalPrice(finalPrice);
    EventManager.dispatch("catalog_product_get_final_price", {product: product, qty: qty});
    finalPrice = product.getData('final_price');
    
    finalPrice = this._applyOptionsPrice(product, qty, finalPrice);
    finalPrice += this.getTotalBundleItemsPrice(product, qty);
    
    finalPrice = Math.max(0, finalPrice);
    product.setFinalPrice(finalPrice);
    
    return finalPrice;
  }
  
  getTotalBundleItemsPrice(product: Product, qty: number = null): number {
    let price = 0;
    
    if (product.hasCustomOptions()) {
      let selectionIds = this.getBundleSelectionIds(product);
      if (selectionIds) {
        let typeInstance: Bundle = <Bundle>product.getTypeInstance();
        let selections           = typeInstance.getSelectionsByIds(selectionIds, product);
        EventManager.dispatch("prepare_catalog_product_collection_prices", {collection: selections, store_id: -1});
        _.forEach(selections, (selection: Product) => {
          let selectionQty = product.getCustomOption("selection_qty_" + selection.getData('selection_id'));
          if (selectionQty) {
            let _selectionPrice = this.getSelectionFinalTotalPrice(
              product,
              selection,
              qty,
              selectionQty.getValue()
            );
            price += parseFloat(<any>_selectionPrice);
          }
        });
      }
    }
    
    
    return price;
  }
  
  protected getBundleSelectionIds(product: Product): any[] {
    let customOption = product.getCustomOption('bundle_selection_ids');
    if (customOption) {
      let selectionIds = customOption.getValue();
      if (_.isString(selectionIds))
        throw new GeneralException("Can't resolve selectionIds, because it's string");
      
      return selectionIds;
    }
    return []
  }
  
  getChildFinalPrice(product: Product, productQty: number, childProduct: Product, childProductQty): number {
    return this.getSelectionFinalTotalPrice(product, childProduct, productQty, childProductQty, false);
  }
  
  /*
   * Calculate final price of selection with take into account tier price
   */
  getSelectionFinalTotalPrice(bundleProduct: Product,
                              selectionProduct: Product,
                              bundleQty: number,
                              selectionQty: number,
                              multiplyQty   = true,
                              takeTierPrice = true): number {
    if (null === bundleQty) {
      bundleQty = 1;
    }
    if (selectionQty === null) {
      selectionQty = selectionProduct.getData('selection_qty');
    }
    
    let price: number;
    if (bundleProduct.getPriceType() == Price.PRICE_TYPE_DYNAMIC) {
      price = selectionProduct.getFinalPrice(takeTierPrice ? selectionQty : 1);
    } else {
      if (selectionProduct.getData('selection_price_type') == "1") {
        // percent
        let product = _.clone(bundleProduct);
        product.setFinalPrice(this.getPrice(product));
        EventManager.dispatch('catalog_product_get_final_price', {product: product, qty: bundleQty});
        price = product.getData('final_price') * (parseFloat(selectionProduct.getData('selection_price_value')) / 100);
      } else {
        // fixed
        price = selectionProduct.getData('selection_price_value');
      }
    }
    
    if (multiplyQty) {
      price *= selectionQty;
    }
    
    let _price = Math.min(
      price,
      this._applyTierPrice(bundleProduct, bundleQty, price),
      this._applySpecialPrice(bundleProduct, price)
    );
    return _price;
  }
  
  protected _applyTierPrice(product: Product, qty: any, finalPrice: number): number {
    if (qty === null) {
      return finalPrice;
    }
    let tierPrice = product.getTierPrice(qty);
    if (_.isNumber(tierPrice)) {
      tierPrice  = finalPrice - finalPrice * (tierPrice / 100);
      finalPrice = Math.min(tierPrice, finalPrice);
    }
    return finalPrice;
  }
  
  getTierPrice(qty: any, product: Product): number | any[] {
    let allCustomersGroupId = GroupManagement.CUST_GROUP_ALL;
    let prices              = product.getTierPriceRawAsArray();
    
    if (prices === null || !_.isArray(prices)) {
      if (qty !== null) {
        return product.getPrice();
      }
      
      return [
        {
          price: product.getPrice(),
          website_price: product.getPrice(),
          price_qty: 1,
          cust_group: prices = product.getTierPriceRawAsArray()
        }
      ];
    }
    
    let custGroup = this._getCustomerGroupId(product);
    
    if (qty) {
      let prevQty: number   = 1;
      let prevPrice: number = 0;
      let prevGroup: number = allCustomersGroupId;
      _.forEach(
        prices, (price) => {
          if (price['cust_group'] != custGroup && price['cust_group'] != allCustomersGroupId) {
            // tier not for current customer group nor is for all groups
            return true;
          }
          if (parseFloat(qty) < parseFloat(price['price_qty'])) {
            // tier is higher than product qty
            return true;
          }
          if (parseFloat(price['price_qty']) < parseFloat(prevQty + "")) {
            // higher tier qty already found
            return true;
          }
          if (parseFloat(price['price_qty']) === parseFloat(prevQty + "")
              && prevGroup != allCustomersGroupId
              && price['cust_group'] == allCustomersGroupId
          ) {
            // found tier qty is same as current tier qty but current tier group is ALL_GROUPS
            return true;
          }
          if (parseFloat(price['website_price']) > parseFloat(prevPrice + "")) {
            prevPrice = parseFloat(price['website_price'] + "");
            prevQty   = parseFloat(price['price_qty']);
            prevGroup = price['cust_group'];
          }
        });
      return prevPrice;
    } else {
      let qtyCache = {};
      _.forEach(
        prices, (price, i) => {
          if (price['cust_group'] != custGroup && price['cust_group'] != allCustomersGroupId) {
            delete price[i];
          } else if (qtyCache.hasOwnProperty(price['price_qty'])) {
            let j = qtyCache[price['price_qty']];
            if (parseFloat(prices[j]['website_price']) < parseFloat(price['website_price'])) {
              delete prices[j];
              qtyCache[price['price_qty']] = i;
            } else {
              delete prices[i];
            }
          } else {
            qtyCache[price['price_qty']] = i;
          }
        });
    }
    
    return prices ? prices : [];
  }
  
  calculateSpecialPrice(finalPrice: number, specialPrice: any, specialPriceFrom: any, specialPriceTo: any, store = null): number {
    if (specialPrice !== null && specialPrice != false) {
      let localeDateTime = ObjectManager.getInstance().get<Timezone>("LocaleDateTime", Timezone);
      if (localeDateTime.isScopeDateInInterval(store, specialPriceFrom, specialPriceTo)) {
        specialPrice = finalPrice * (specialPrice / 100);
        finalPrice   = Math.min(parseFloat(finalPrice + ""), parseFloat(specialPrice));
      }
    }
    return finalPrice;
  }
}
