import {StoreManager} from "../../store/Model/StoreManager";
import {ShareInstance} from "../../General/ObjectManager/ShareInstance";
import {Currency} from "./Currency";
import {Environment} from "../../General/Environment";

export class PriceCurrency implements ShareInstance {
    static CODE_INSTANCE = "PriceCurrency";

    round(price: number, places: number = 2): number {
        if (Environment.MAGENTO_VERSION == 2)
            places = 7;
        return +(Math.round(parseFloat(parseFloat(price + "") + "e+" + places)) + "e-" + places);
    }

    getStore() {
        return StoreManager.getStore();
    }

    convert(amount: number, scope: any = null, currency: any = null): number {
        return amount * StoreManager.getStore().getRate();
    }

    getCurrency(): Currency {
        return StoreManager.getStore().getCurrentCurrency();
    }

}