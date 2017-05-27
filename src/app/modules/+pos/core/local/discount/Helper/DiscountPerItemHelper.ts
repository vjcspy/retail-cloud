import {Item} from "../../../framework/quote/Model/Quote/Item";
import {StoreManager} from "../../../framework/store/Model/StoreManager";
export class DiscountPerItemHelper {
    static DISCOUNT_PER_ITEM_KEY         = 'discount_per_item';
    static DISCOUNT_PER_ITEM_PERCENT_KEY = 'retail_discount_per_items_percent';

    getItemBaseDiscountCalculationPrice(item: Item) {
        // Nếu là tính tax trên giá có thuế thì sẽ ra giá này. Còn không thì lấy getBaseCalculationPriceOriginal.
        let price = item.getData('base_discount_calculation_price');

        return price == null ? item.getBaseCalculationPrice() : price;
    }

    getItemDiscount(item: Item): number {
        if (!item.getData('buy_request'))
            return 0;

        // uu tien discount per item percent truoc
        if (!!item.getData('buy_request').getData(DiscountPerItemHelper.DISCOUNT_PER_ITEM_PERCENT_KEY)) {
            return this.getItemBaseDiscountCalculationPrice(item) *
                   parseFloat(item.getData('buy_request').getData(DiscountPerItemHelper.DISCOUNT_PER_ITEM_PERCENT_KEY)) / 100;
        }
        if (!!item.getData('buy_request').getData(DiscountPerItemHelper.DISCOUNT_PER_ITEM_KEY)) {
            let rate = StoreManager.getStore().convertPrice(1);
            return parseFloat(item.getData('buy_request').getData(DiscountPerItemHelper.DISCOUNT_PER_ITEM_KEY) + "") / rate;
        }
        return 0;
    }
}