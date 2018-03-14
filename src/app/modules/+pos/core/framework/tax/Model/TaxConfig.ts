import {Store} from "../../store/Model/Store";
import {GeneralException} from "../../General/Exception/GeneralException";

export class TaxConfig {
  static set taxConfig(value: Object) {
    this._taxConfig = value;
  }

  private static _taxConfig: Object;


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
    return this.loadConfig('display_cart_shipping_excl_tax');
  }

  displaySalesShippingExclTax() {
    return this.loadConfig('display_sales_shipping_excl_tax');
  }

  loadConfig(key): any {
    if (TaxConfig._taxConfig.hasOwnProperty(key))
      return TaxConfig._taxConfig[key];
    throw new GeneralException("Can't load config " + key);
  }
}
