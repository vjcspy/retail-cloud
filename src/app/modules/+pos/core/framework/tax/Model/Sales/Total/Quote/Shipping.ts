import {CommonTaxCollector} from "./CommonTaxCollector";
import {Quote} from "../../../../../quote/Model/Quote";
import {Address} from "../../../../../quote/Model/Quote/Address";
import {Total} from "../../../../../quote/Model/Quote/Address/Total";
import * as _ from "lodash";
export class Shipping extends CommonTaxCollector {
    // checkout order sort order
    protected _totalSortOrder = 50;

    private _store;
    private _areTaxRequestsSimilar;

    constructor() {
        super();
        this._canSetAddressAmount   = true;
        this._canAddAmountToAddress = true;
        this.setCode('shipping');
    }

    collect(quote: Quote, address: Address, total: Total): Shipping {
        this._setAddress(address);

        this._store         = address.getQuote().getStore();
        let storeTaxRequest = this.getCalculator().getRateOriginRequest();
        let customer        = address.getQuote().getCustomer();
        this.getCalculator().setCustomer(customer);
        let addressTaxRequest = this.getCalculator()
                                    .getRateRequest(address, address.getQuote().getBillingAddress(), customer.getCustomerTaxClassId(), this._store);

        let shippingTaxClass = this.getTaxConfig().getShippingTaxClass();
        storeTaxRequest.setData('product_class_id', shippingTaxClass);
        addressTaxRequest.setData('product_class_id', shippingTaxClass);

        let priceIncludesTax = this.getTaxConfig().shippingPriceIncludesTax();

        if (priceIncludesTax) {
            if (this.getTaxConfig().isCrossBorderTradeEnabled()) {
                this._areTaxRequestsSimilar = true;
            } else {
                this._areTaxRequestsSimilar = this.getCalculator().compareRequests(storeTaxRequest, addressTaxRequest);
            }
        }

        let shipping, taxShipping,
            baseShipping, baseTaxShipping,
            taxable, baseTaxable,
            isPriceInclTax: boolean,
            rate;
        shipping = taxShipping = address.getData('shipping_amount');
        baseShipping = baseTaxShipping = address.getData('base_shipping_amount');
        rate = this.getCalculator().getRate(addressTaxRequest);
        let tax, baseTax;
        if (priceIncludesTax) {
            if (this._areTaxRequestsSimilar) {
                tax             = this._round(this.getCalculator().calcTaxAmount(shipping, rate, true, false), rate, true);
                baseTax         = this._round(this.getCalculator().calcTaxAmount(baseShipping, rate, true, false), rate, true, 'base');
                taxShipping     = shipping;
                baseTaxShipping = baseShipping;
                shipping        = taxShipping - tax;
                baseShipping    = baseTaxShipping - baseTax;
                taxable         = taxShipping;
                baseTaxable     = baseTaxShipping;
                isPriceInclTax  = true;
            } else {
                let storeRate    = this.getCalculator().getStoreRate(addressTaxRequest, this._store);
                let storeTax     = this.getCalculator().calcTaxAmount(shipping, storeRate, true, false);
                let baseStoreTax = this.getCalculator().calcTaxAmount(baseShipping, storeRate, true, false);
                shipping         = this.getCalculator().round(shipping - storeTax);
                baseShipping     = this.getCalculator().round(baseShipping - baseStoreTax);
                tax              = this._round(this.getCalculator().calcTaxAmount(shipping, rate, false, false), rate, true);
                baseTax          = this._round(this.getCalculator().calcTaxAmount(baseShipping, rate, false, false), rate, true, 'base');
                taxShipping      = shipping + tax;
                baseTaxShipping  = baseShipping + baseTax;
                taxable          = taxShipping;
                baseTaxable      = baseTaxShipping;
                isPriceInclTax   = true;
            }
        } else {
            let appliedRates = this.getCalculator().getAppliedRates(addressTaxRequest);
            let taxes        = [];
            let baseTaxes    = [];
            _.forEach(appliedRates, (appliedRate) => {
                let taxRate = appliedRate['percent'];
                let taxId   = appliedRate['id'];
                taxes.push(this._round(this.getCalculator().calcTaxAmount(shipping, taxRate, false, false), taxId, false));
                baseTaxes.push(this._round(this.getCalculator().calcTaxAmount(baseShipping, taxRate, false, false), taxId, false, 'base'));
            });
            tax = 0;
            _.forEach(taxes, (t) => {
                tax += t;
            });
            baseTax = 0;
            _.forEach(baseTaxes, (t) => {
                baseTax += t;
            });
            taxShipping     = shipping + tax;
            baseTaxShipping = baseShipping + baseTax;
            taxable         = shipping;
            baseTaxable     = baseShipping;
            isPriceInclTax  = false;
        }
        address.setTotalAmount('shipping', shipping);
        address.setBaseTotalAmount('shipping', baseShipping);

        address.setData('shipping', shipping);
        address.setData('base_shipping', baseShipping);
        address.setData('shipping_incl_tax', taxShipping);
        address.setData('base_shipping_incl_tax', baseTaxShipping);
        address.setData('shipping_taxable', taxable);
        address.setData('base_shipping_taxable', baseTaxable);
        address.setData('is_shipping_incl_tax', isPriceInclTax);
        if (this.getTaxConfig().discountTax()) {
            address.setData('shipping_amount_for_discount', taxShipping);
            address.setData('base_shipping_amount_for_discount', taxShipping);
        }
        return this;
    }

    protected _round(price: number, rate: any, direction: boolean, type: string = 'regular') {
        if (!price) {
            return this.getCalculator().round(price);
        }

        let deltas = this._address.getData('rounding_deltas');
        let key    = type + direction;
        deltas     = (typeof deltas[key] == "object" && typeof deltas[key][rate + ''] != "undefined") ? deltas[key][rate + ''] : 0;
        return this.getCalculator().round(price + deltas);
    }
}