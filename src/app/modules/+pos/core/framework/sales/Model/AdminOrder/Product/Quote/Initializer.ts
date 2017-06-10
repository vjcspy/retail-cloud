import {Quote} from "../../../../../quote/Model/Quote";
import {Product} from "../../../../../catalog/Model/Product";
import {DataObject} from "../../../../../General/DataObject";
import {AbstractType} from "../../../../../catalog/Model/Product/Type/AbstractType";
import {Item} from "../../../../../quote/Model/Quote/Item";
export class Initializer {
    init(quote: Quote, product: Product, config: DataObject): Item|string {
        let stockItem = product.getData('stock_items');
        if (stockItem && stockItem.hasOwnProperty('is_qty_decimal') && stockItem['is_qty_decimal'] == 1) {
            product.setData('is_qty_decimal', 1);
        }
        else {
            config.setData('qty', parseInt(config.getData('qty')));
        }

        product.setData('cart_qty', config.getData('qty'));
        return quote.addProduct(product, config, AbstractType.PROCESS_MODE_FULL);
    }
}
