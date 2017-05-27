import {DataObject} from "../../../../../General/DataObject";
import {Option} from "../../Option";
import {Product} from "../../../Product";
export class DefaultType extends DataObject {
    // Chinh la option trong database
    protected _option: Option;
    protected _product: Product;

    setOption(option: Option): DefaultType {
        this._option = option;
        return this;
    }

    getOption(): Option {
        return this._option;
    }

    setProduct(product: Product): DefaultType {
        this._product = product;
        return this;
    }

    getProduct(): Product {
        return this._product;
    }

    getOptionPrice(optionValue: string, basePrice: number) {
        let option = this.getOption();

        return this._getChargableOptionPrice(option.getPrice(), option.getPriceType() == 'percent', basePrice);
    }

    protected _getChargableOptionPrice(price: number, isPercent: boolean, basePrice: number) {
        if (isNaN(price))
            return 0;

        if (isPercent) {
            return parseFloat(basePrice * price / 100 + "");
        } else {
            return parseFloat(price + "");
        }
    }
}