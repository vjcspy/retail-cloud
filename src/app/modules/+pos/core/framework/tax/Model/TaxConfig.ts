import {Store} from "../../store/Model/Store";
import {ObjectManager} from "../../General/App/ObjectManager";
import {SettingManagement} from "../../setting/SettingManagement";
import {GeneralException} from "../../General/Exception/GeneralException";
export class TaxConfig {
    private _taxConfig: Object;


    priceIncludesTax(store: Store = null): boolean {
        return this.loadConfig('price_includes_tax');
    }

    applyTaxOnCustomPrice() {
        return this.loadConfig('tax_on_custom_price');
    }

    getCalculationSequence(): string {
        return this.loadConfig('calculation_sequence');
    }

    getShippingTaxClass(): string {
        return this.loadConfig('shipping_tax_class');
    }

    shippingPriceIncludesTax(): boolean {
        return this.loadConfig('shipping_price_includes_tax');
    }

    isCrossBorderTradeEnabled(): boolean {
        return this.loadConfig('cross_border_trade_enabled');
    }

    discountTax() {
        return this.loadConfig('discount_tax');
    }

    getAlgorithm() {
        return this.loadConfig('algorithm');
    }

    displayCartPricesExclTax() {
        return this.loadConfig('display_cart_price_excl_tax');
    }

    displaySalesPricesExclTax() {
        return this.loadConfig('display_sales_prices_excl_tax');
    }


    displayCartSubtotalExclTax() {
        return this.loadConfig('display_cart_subtotal_excl_tax');
    }

    displaySalesSubtotalExclTax() {
        return this.loadConfig('display_sales_subtotal_excl_tax');
    }

    displayCartShippingExclTax() {
        return true || this.loadConfig('display_cart_shipping_excl_tax');
    }

    displaySalesShippingExclTax() {
        return true || this.loadConfig('display_sales_shipping_excl_tax');
    }

    initConfig(): void {
        if (typeof this._taxConfig == "undefined") {
            this._taxConfig = this._getSetting().getStoreConfigGroup('tax');
        }
    }

    protected _getSetting(): SettingManagement {
        return ObjectManager.getInstance().get<SettingManagement>(SettingManagement.CODE_INSTANCE, SettingManagement);
    }

    loadConfig(key): any {
        this.initConfig();
        if (this._taxConfig.hasOwnProperty(key))
            return this._taxConfig[key];
        throw new GeneralException("Can't load config " + key);
    }
}