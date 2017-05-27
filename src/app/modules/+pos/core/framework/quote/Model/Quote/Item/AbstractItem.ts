import {DataObject} from "../../../../General/DataObject";
import {PriceCurrency} from "../../../../directory/Model/PriceCurrency";
import {ObjectManager} from "../../../../General/App/ObjectManager";
import {Store} from "../../../../store/Model/Store";
import {StoreManager} from "../../../../store/Model/StoreManager";
import {Product} from "../../../../catalog/Model/Product";
import * as _ from "lodash";
import {GeneralException} from "../../../../General/Exception/GeneralException";
import {AbstractType} from "../../../../catalog/Model/Product/Type/AbstractType";

export abstract class AbstractItem extends DataObject {
    protected _optionsByCode: any;
    protected _children: AbstractItem[] = [];
    protected _parentItem               = null;

    calcRowTotal() {
        let qty       = this.getTotalQty();
        // Round unit price before multiplying to prevent losing 1 cent on subtotal
        let total     = this.getPriceCurrency().round(this.getCalculationPriceOriginal()) * qty;
        let baseTotal = this.getPriceCurrency().round(this.getBaseCalculationPriceOriginal()) * qty;

        this.setData('row_total', this.getPriceCurrency().round(total));
        this.setData('base_row_total', this.getPriceCurrency().round(baseTotal));
        return this;
    }

    getTotalQty() {
        if (this.getParentItem()) {
            return this.getQty() * this.getParentItem().getQty();
        }
        return this.getQty();
    }

    getQty(): number {
        return parseFloat(this.getData('qty') + "");
    }

    setQty(qty: number): AbstractItem {
        this.setData('qty', qty);
        return this;
    }

    getPriceCurrency(): PriceCurrency {
        return ObjectManager.getInstance().get<PriceCurrency>(PriceCurrency.CODE_INSTANCE, PriceCurrency);
    }

    /*
     * Giá này dùng để làm giá đầu vào tính toán.
     * Ở quote_subtotal sẽ không quan tâm là giá có thuế hay không có thuế. Là giá mà user set vào backend lúc đầu.
     * Giá này được set lại về null mỗi khi collect quote_subtotal
     *
     * Get item price used for quote calculation process.
     * This method get original custom price applied before tax calculation
     *
     */
    getCalculationPriceOriginal(): number {
        let price = this.getData('calculation_price');
        if (price === null) {
            if (this.hasData('original_custom_price')) {
                price = this.getData('original_custom_price');
            } else {
                price = this.getConvertedPrice();
            }
            this.setData('calculation_price', price);
        }
        return price;
    }

    /*
     * Khi tính thuế sẽ get giá calculation price original bởi vì đó là giá nhập vào.
     * Còn giá này là giá đã bị tăng giảm bởi thuế rồi. Sử dụng trong discount.
     *
     */
    getCalculationPrice(): number {
        let price = this.getData('calculation_price');
        if (price === null) {
            if (this.hasData('custom_price')) {
                price = this.getData('custom_price');
            } else {
                price = this.getConvertedPrice();
            }
            this.setData('calculation_price', price);
        }
        return price;
    }

    getBaseCalculationPrice(): number {
        if (!this.hasData('base_calculation_price')) {
            let price: number;
            if (this.hasData('custom_price')) {
                price = parseFloat(this.getData('custom_price'));
                if (price) {
                    let rate = StoreManager.getStore().getRate();
                    price    = price / rate;
                }
            } else {
                price = this.getPrice();
            }
            this.setData('base_calculation_price', price);
        }
        return this.getData('base_calculation_price');
    }

    getBaseCalculationPriceOriginal(): number {
        if (!this.hasData('base_calculation_price')) {
            let price: number;
            if (this.hasData('original_custom_price')) {
                price = parseFloat(this.getData('original_custom_price'));
                if (price) {
                    let rate = StoreManager.getStore().getRate();
                    price    = price / rate;
                }
            } else {
                price = this.getPrice();
            }
            this.setData('base_calculation_price', price);
        }
        return this.getData('base_calculation_price');
    }

    getPrice(): number {
        return parseFloat(this.getData('price') + "");
    }

    /*
     * Khi set price cần set các giá tính trên price về null để tính lại các giá đó.
     */
    setPrice(price: number): AbstractItem {
        this.setData('base_calculation_price', null);
        this.setConvertedPrice(null);
        return <AbstractItem>this.setData('price', price);
    }

    getStore(): Store {
        return StoreManager.getStore();
    }

    getConvertedPrice(): number {
        let price = this.getData('converted_price');
        if (price === null) {
            price = this.getPriceCurrency().convert(this.getPrice(), this.getStore());
            this.setData('converted_price', price);
        }
        return price;
    }

    getProduct(): Product {
        let product: Product = this.getData('product');

        if (!product)
            throw new GeneralException("Can't get product from item.");
        /**
         * Reset product final price because it related to custom options
         */
        product.setFinalPrice(null);
        if (this._optionsByCode) {
            product.setCustomOptions(this._optionsByCode);
        }
        return product;
    }

    getBaseTaxCalculationPrice(): number {
        return this.getData('base_tax_calculation_price');
    }

    setBaseTaxCalculationPrice(price: number): AbstractItem {
        return <any>this.setData('base_tax_calculation_price', price);
    }

    getBaseDiscountAmount(): number {
        return this.getData('base_discount_amount');
    }

    setBaseDiscountAmount(discount: number): AbstractItem {
        return <any>this.setData('base_discount_amount', discount);
    }

    getTaxCalculationPrice(): number {
        return this.getData('tax_calculation_price');
    }

    setTaxCalculationPrice(price: number): AbstractItem {
        return <any>this.setData('tax_calculation_price', price);
    }

    getDiscountAmount(): number {
        return this.getData('discount_amount');
    }

    setDiscountAmount(discount: number): AbstractItem {
        return <any>this.setData('discount_amount', discount);
    }

    getHasChildren(): boolean {
        return this.getData('has_children');
    }

    setHasChildren(hasChildren: boolean): AbstractItem {
        return <any>this.setData('has_children', hasChildren);
    }

    setBaseOriginalPrice(price: number): AbstractItem {
        return <any>this.setData('base_original_price', price);
    }

    getBaseOriginalPrice(): number {
        return parseFloat(this.getData('base_original_price') + "");
    }

    /*
     * Get original price (retrieved from product) for item. Lấy từ product xong set vào lúc collect quote_subtotal
     * Original price value is in quote selected currency
     * */
    getOriginalPrice(): number {
        let price = this.getData('original_price');
        if (price == null) {
            price = this.getStore().convertPrice(this.getBaseOriginalPrice());
            if (!isNaN(price))
                this.setData('original_price', price);
        }
        return price;
    }

    setCustomPrice(value: number): AbstractItem {
        this.setData('calculation_price', value);
        this.setData('base_calculation_price', null);
        return <any>this.setData('custom_price', value);
    }

    /*
     * Set new value for converted price.
     * Sẽ set lại giá này thành giá excl tax sau khi collect tax_subtotal
     * Bởi vì discont có thể là trên giá incl/excl tax mà lúc get discount thì get từ calculation price -> lấy từ giá này -> cần set lại
     */
    setConvertedPrice(price: number): AbstractItem {
        this.setData('calculation_price', null);
        this.setData('converted_price', price);
        return this;
    }

    /*
     * Get parent item lúc addProduct ở trong quote có set
     * Hiện tại chưa thấy function get prarent trong product mà chỉ thấy trong quote item
     */
    getParentItem(): AbstractItem {
        return this._parentItem;
    }


    /*
     * Set giá trị này lúc addProduct ở quote
     */
    setParentItem(parentItem: AbstractItem): AbstractItem {
        if (parentItem) {
            this._parentItem = parentItem;
            parentItem.addChild(this);
        }
        return this;
    }

    getChildren(): AbstractItem[] {
        return this._children;
    }

    addChild(child: AbstractItem): AbstractItem {
        this.setData('has_children', true);
        this._children.push(child);

        return this;
    }

    isChildrenCalculated() {
        let calculated: number = null;
        if (this.getParentItem()) {
            calculated = this.getParentItem().getProduct().getPriceType();
        } else {
            calculated = this.getProduct().getPriceType();
        }

        return calculated !== null && calculated == AbstractType.CALCULATE_CHILD;

    }

}
