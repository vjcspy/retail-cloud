import {Currency} from "../../directory/Model/Currency";
import {ObjectManager} from "../../General/App/ObjectManager";
import {PriceCurrency} from "../../directory/Model/PriceCurrency";
import {StoreDB} from "../../../../database/xretail/db/store";

export class Store extends StoreDB {
    getCode(): string {
        return this.getData('code');
    }

    getId(): number {
        return this.getData('id');
    }

    getPriceFormat(): Object {
        return this.getData('price_format');
    }

    getRate(): number {
        return this.getData('rate');
    }

    getCurrentCurrency(): Currency {
        return this.getData('current_currency');
    }

    getBaseCurrency(): Currency {
        return this.getData('base_currency');
    }

    isActive(): boolean {
        return this.getData('is_active') == "1";
    }

    getSortOrder(): number {
        return this.getData('sort_order');
    }

    getName(): string {
        return this.getData('name');
    }

    getGroupId(): number {
        return this.getData('group_id');
    }

    getWebsiteId(): number {
        return this.getData('website_id');
    }

    geCode(): number {
        return this.getData('code');
    }


    roundPrice(price: number): number {
        // alway round 4
        return this._round(price, 4);
    }

    _round(value, exp) {
        if (typeof exp === 'undefined' || +exp === 0)
            return Math.round(value);

        value = +value;
        exp   = +exp;

        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
            return NaN;

        // Shift
        value = value.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
    }

    convertPrice(price: number, format = false, includeContainer = true): number {
        let value = parseFloat(price + "");
        if (this.getCurrentCurrency() && this.getBaseCurrency()) {
            // Chỉ làm việc với store hiện tại nên cũng chả cần phải truyền giá trị gì vào.
            value = this.getPriceCurrency().convert(value);
        } else {

        }

        return value;
    }

    getPriceCurrency(): PriceCurrency {
        return ObjectManager.getInstance().get<PriceCurrency>(PriceCurrency.CODE_INSTANCE, PriceCurrency);
    }
}