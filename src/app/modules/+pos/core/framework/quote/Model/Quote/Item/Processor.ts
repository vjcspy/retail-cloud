import {Product} from "../../../../catalog/Model/Product";
import {DataObject} from "../../../../General/DataObject";
import {Item} from "../Item";
import * as _ from "lodash";
import {StoreManager} from "../../../../store/Model/StoreManager";
export class Processor {
    init(product: Product, request: DataObject): Item {
        let item = new Item();
        item.setData('store_id', StoreManager.getStore().getId());

        if (item.getData('id') && product.getData('parent_product_id'))
            return item;

        item.setData('options', product.getCustomOptions());
        item.setData('product', product);
        if (request.getData('request_count') && !product.getData('stick_within_parent') && item.getData('id') === request.getData('id')) {
            item.setData('qty', 0);
        }
        return item;
    }

    /*
     *Set qty and custom price for quote item
     */
    prepare(item: Item, request: DataObject, candidate: Product): void {
        /**
         * We specify qty after we know about parent (for stock)
         */
        if (request.getData('reset_count') && !candidate.getData('stick_within_parent') && item.getData('id') == request.getData('id')) {
            item.setData('qty', 0);
        }

        item.addQty(candidate.getData('cart_qty'));

        let customerPrice = request.getData('custom_price');
        if (customerPrice) {
            item.setData('custom_price', customerPrice);
            item.setData('original_custom_price', customerPrice);
        }
    }
}