import {Product} from "../../Product";
import {GroupManagement} from "../../../../customer/Model/GroupManagement";
import * as _ from "lodash";
import {EventManager} from "../../../../General/Event/EventManager";
import {Session} from "../../../../customer/Model/Session";
import {ObjectManager} from "../../../../General/App/ObjectManager";
import {Timezone} from "../../../../General/DateTime/Timezone";
import {DataObject} from "../../../../General/DataObject";
import {Option} from "../Option";
import {Option as ConfigurationOption} from "../Configuration/Option";
import {DefaultType} from "../Option/Type/DefaultType";

export class Price {

    getPrice(product: Product): number {
        return parseFloat(product.getData('price') + "");
    }

    /*
     * Get base price with apply Group, Tier, Special prises
     */
    getBasePrice(product: Product, qty = null): number {
        let price: number = parseFloat(product.getPrice() + '');

        return Math.min(
            this._applyTierPrice(product, qty, price),
            this._applySpecialPrice(product, price)
        );
    }

    getFinalPrice(qty: number, product: Product): number {
        if (qty === null && product.getData('calculated_final_price') !== null) {
            return product.getData('calculated_final_price');
        }
        let finalPrice = this.getBasePrice(product, qty);
        product.setData('final_price', finalPrice);

        EventManager.dispatch('catalog_product_get_final_price', {product: product, qty: qty});

        finalPrice = product.getData('final_price');

        finalPrice = this._applyOptionsPrice(product, qty, finalPrice);

        finalPrice = Math.max(0, finalPrice);
        product.setData('final_price', finalPrice);

        return finalPrice;
    }

    protected _applyTierPrice(product: Product, qty: any, finalPrice: number): number {
        if (qty === null) {
            return finalPrice;
        }
        let tierPrice = product.getTierPrice(qty);
        if (_.isNumber(tierPrice))
            finalPrice = Math.min(tierPrice, finalPrice);

        return finalPrice;
    }

    protected _applyOptionsPrice(product: Product, qty: number, finalPrice: number): number {
        // custom_option da duoc set khi add item vao cart
        let productCustomOption: Object = product.getCustomOptions();

        if (productCustomOption.hasOwnProperty('option_ids')) {
            let optionIds: DataObject = productCustomOption['option_ids'];
            let basePrice: number     = finalPrice;
            _.forEach(
                optionIds.getData('value').split(","), (optionId) => {
                    let option: Option = product.getOptionById(parseInt(optionId));
                    if (!!option) {
                        // chinh la gia tri ma user da chon. Vi luc add vao da dua ve dang configuration option nen gia tri lay ra se la instance
                        let confItemOption: ConfigurationOption = product.getCustomOption('option_' + option.getData('option_id'));

                        let group: DefaultType = option.groupFactory(option.getData('type'))
                                                       .setOption(option)
                                                       .setData('configuration_item_option', confItemOption);

                        finalPrice += group.getOptionPrice(confItemOption.getValue(), basePrice);
                    }
                });
        }

        return finalPrice;
    }

    getTierPrice(qty, product: Product): number|Object {
        let allGroupsId = GroupManagement.CUST_GROUP_ALL;

        let prices = product.getTierPriceRawAsArray();
        if (prices == null || !_.isArray(prices)) {
            if (qty !== null) {
                return product.getPrice();
            } else {
                return {
                    price: product.getPrice(),
                    website_price: product.getPrice(),
                    price_qty: 1,
                    cust_group: allGroupsId
                };
            }
        }

        let custGroup = this._getCustomerGroupId(product);

        if (qty) {
            let prevQty: number   = 1;
            let prevPrice: number = product.getPrice();
            let prevGroup: number = allGroupsId;
            _.forEach(
                prices, (price) => {
                    if (price['cust_group'] != custGroup && price['cust_group'] != allGroupsId) {
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
                    if (parseFloat(price['price_qty']) == parseFloat(prevQty + "")
                        && prevGroup != allGroupsId
                        && price['cust_group'] == allGroupsId
                    ) {
                        // found tier qty is same as current tier qty but current tier group is ALL_GROUPS
                        return true;
                    }
                    if (parseFloat(price['website_price']) < parseFloat(prevPrice + "")) {
                        prevPrice = parseFloat(price['website_price'] + "");
                        prevQty   = price['price_qty'];
                        prevGroup = price['cust_group'];
                    }
                });
            return prevPrice;
        } else {
            let qtyCache = {};
            _.forEach(
                prices, (price, priceKey) => {
                    if (price['cust_group'] != custGroup && price['cust_group'] != allGroupsId) {
                        delete price[priceKey];
                    } else if (qtyCache.hasOwnProperty(price['price_qty'])) {
                        let priceQty = qty[price['price_qty']];
                        if (parseFloat(prices[priceQty]['website_price']) > parseFloat(price['website_price'])) {
                            delete prices[priceQty];
                            qtyCache[price['price_qty']] = priceKey;
                        } else {
                            delete prices[priceKey];
                        }
                    } else {
                        qtyCache[price['price_qty']] = priceKey;
                    }
                });
        }
        return prices ? prices : {};
    }

    protected _getCustomerGroupId(product: Product): number|string {
        // configurable tính giá trên thằng con mà lúc đó thằng con chưa được set lại customer_group id nên sẽ lỗi
        // if (!!product && product.getData('customer_group_id') != null)
        //     return product.getData('customer_group_id');

        return this.getCustomerSession().getCustomerGroupId();
    }

    protected _applySpecialPrice(product: Product, finalePrice: number): number {
        return this.calculateSpecialPrice(
            finalePrice,
            product.getData('special_price'),
            product.getData('special_from_date'),
            product.getData('special_to_date'),
            product.getData('store'));
    }

    calculateSpecialPrice(finalPrice: number, specialPrice: any, specialPriceFrom: any, specialPriceTo: any, store = null): number {
        if (specialPrice !== null && specialPrice != false) {
            let localeDateTime = ObjectManager.getInstance().get<Timezone>("LocaleDateTime", Timezone);
            if (localeDateTime.isScopeDateInInterval(store, specialPriceFrom, specialPriceTo))
                finalPrice = Math.min(parseFloat(finalPrice + ""), parseFloat(specialPrice));
        }
        return finalPrice;
    }

    protected getCustomerSession(): Session {
        return ObjectManager.getInstance().get<Session>('CustomerSession', Session);
    }

    getChildFinalPrice(product: Product, productQty: number, childProduct: Product, childProductQty): number {
        return this.getFinalPrice(childProductQty, childProduct);
    }
}