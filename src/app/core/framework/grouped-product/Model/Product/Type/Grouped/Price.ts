import {Price as SimplePrice} from "../../../../../catalog/Model/Product/Type/Price";
import {Product} from "../../../../../catalog/Model/Product";
import {Grouped} from "../Grouped";
import * as _ from "lodash";
export class Price extends SimplePrice {
    getFinalPrice(qty: number, product: Product): number {
        if (qty === null && product.getData('calculated_final_price') !== null) {
            return product.getData('calculated_final_price');
        }

        let finalPrice = super.getFinalPrice(qty, product);
        if (product.hasCustomOptions()) {
            let typeInstance      = <Grouped>product.getTypeInstance();
            let associatedProducs = typeInstance.getAssociatedProducts(product);

            _.forEach(associatedProducs, (childProduct: Product)=> {
                let option = product.getCustomOption('associated_product_' + childProduct.getData('id'));
                if (!option)
                    return true;

                let childQty = parseFloat(option.getValue());
                if (!childQty)
                    return true;

                finalPrice += childProduct.getFinalPrice(childQty) * childQty;
            });
        }

        product.setFinalPrice(finalPrice);

        return Math.max(0, product.getData('final_price'));
    }
}