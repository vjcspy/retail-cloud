import {Price as SimplePrice} from "../../../../../catalog/Model/Product/Type/Price";
import {GeneralException} from "../../../../../General/Exception/GeneralException";
import {Product} from "../../../../../catalog/Model/Product";
export class Price extends SimplePrice {
    getFinalPrice(qty: number, product: Product): number {
        if (qty === null && product.getData('calculated_final_price') !== null) {
            return product.getData('calculated_final_price');
        }
        let finalPrice: number;
        if (product.getCustomOption('simple_product') && product.getCustomOption('simple_product').getData('product')) {
            finalPrice = super.getFinalPrice(qty, product.getCustomOption('simple_product').getData('product'));
        } else {
            throw new GeneralException("Not support")
        }
        finalPrice = this._applyOptionsPrice(product, qty, finalPrice);
        finalPrice = Math.max(0, finalPrice);
        product.setFinalPrice(finalPrice);

        return finalPrice;
    }

    getPrice(product) {
        if (product.getCustomOption('simple_product')) {
            return product.getCustomOption('simple_product').getData('product').getPrice();
        } else {
            return 0;
        }
    }
}