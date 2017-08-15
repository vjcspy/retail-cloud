import {AbstractTotal} from "./AbstractTotal";
import * as _ from "lodash";
import {Address} from "../../Address";
import {Quote} from "../../../Quote";
import {Total} from "../Total";
import {Item} from "../../Item";
import {Product} from "../../../../../catalog/Model/Product";

/*
 * Trong này chỉ Không biết tax là gì, không biết giá convert là gì.
 *
 * Bản chất trong này chỉ:
 *  + set lại price của product chính là giá store đã apply các giá khuyến mại
 *  + set giá original price để so sánh sau này
 */
export class Subtotal extends AbstractTotal {
    // checkout order sort order
    protected _totalSortOrder = 10;

    constructor() {
        super();
        this.setCode("subtotal");
        this._canAddAmountToAddress = true;
        this._canSetAddressAmount   = true;
    }

    collect(quote: Quote, address: Address, total: Total = null): Subtotal {
        /*Tất cả nhưng collector mà gọi supper collect đều sẽ nằm trong totals*/
        super.collect(quote, address, total);

        let virtualAmount     = 0;
        let baseVirtualAmount = 0;

        _.forEach(
            address.getItems(), (item: Item) => {
                if (this._initItem(address, item) && item.getQty() > 0) {
                    /**
                     * Separatly calculate subtotal only for virtual products
                     */
                    if (item.getProduct().isVirtual()) {
                        virtualAmount += item.getData('row_total');
                        baseVirtualAmount += item.getData('base_row_total');
                    }
                } else {
                    this._removeItem(address, item);
                }
            });

        address.setData('base_virtual_amount', baseVirtualAmount);
        address.setData('virtual_amount', virtualAmount);

        return this;
    }

    protected _initItem(address: Address, item: Item): boolean {

        let quoteItem: Item = item;

        let product: Product = quoteItem.getProduct();
        product.setCustomerGroupId(this.getCustomerSession().getCustomerGroupId());

        item.setConvertedPrice(null);

        let originalPrice = product.getPrice();

        if (quoteItem.getParentItem() && quoteItem.isChildrenCalculated()) {
            let finalPrice = quoteItem.getParentItem()
                                      .getProduct()
                                      .getPriceModel()
                                      .getChildFinalPrice(quoteItem.getParentItem().getProduct(),
                                                          quoteItem.getParentItem().getQty(),
                                                          product,
                                                          quoteItem.getQty());
            this._calculateRowTotal(item, finalPrice, originalPrice);
        } else if (!quoteItem.getParentItem()) {
            // reset final price in case item used before(child product of configurable)
            product.setData('final_price', null);

            let finalPrice = product.getFinalPrice(quoteItem.getQty());
            this._calculateRowTotal(item, finalPrice, originalPrice);
            this._addAmount(item.getData('row_total'));
            this._addBaseAmount(item.getData('base_row_total'));
            address.setData('total_qty', address.getData('total_qty') + item.getQty());
        }
        return true;
    }

    protected _calculateRowTotal(item: Item, finalPrice: number, originalPrice: number): Subtotal {
        // mangeto haven't. Check item has sales
        if (finalPrice < originalPrice) {
            item.setData('posIsSales', 1);
        }

        if (!originalPrice) {
            originalPrice = finalPrice;
        }

        /*
         * set bằng với giá price của sản phẩm để sau này sẽ dùng ở chỗ tính tax. Lúc mà có giá custom_price nhưng lại muốntính tax trên original
         * Price
         */
        item.setPrice(finalPrice)
            .setBaseOriginalPrice(originalPrice)
            .calcRowTotal();

        return this;
    }

    protected _removeItem(address: Address, item: Item): Subtotal {
        return this;
    }
}
