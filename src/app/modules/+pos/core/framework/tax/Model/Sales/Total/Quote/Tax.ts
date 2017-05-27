import {CommonTaxCollector} from "./CommonTaxCollector";
import {Quote} from "../../../../../quote/Model/Quote";
import {Address} from "../../../../../quote/Model/Quote/Address";
import {Total} from "../../../../../quote/Model/Quote/Address/Total";
import {Store} from "../../../../../store/Model/Store";
import {Customer} from "../../../../../customer/Model/Customer";
import {GeneralException} from "../../../../../General/Exception/GeneralException";
import {DataObject} from "../../../../../General/DataObject";
import * as _ from "lodash";
import {Item} from "../../../../../quote/Model/Quote/Item";
import {Calculation} from "../../../Calculation";
import {EventManager} from "../../../../../General/Event/EventManager";

export class Tax extends CommonTaxCollector {
    // checkout order sort order
    protected _totalSortOrder = 70;

    private _roundingDeltas;
    private _baseRoundingDeltas;
    private _hiddenTaxes = [];

    private _store: Store;
    private _areTaxRequestsSimilar;

    constructor() {
        super();
        this._canAddAmountToAddress = true;
        this._canSetAddressAmount   = true;
        this.setCode('tax');
    }

    protected _roundTotals(address: Address): Tax {
        let totalDelta     = 0.000001;
        let baseTotalDelta = 0.000001;

        let totalCodes = ['tax', 'hidden_tax', 'shipping_hidden_tax', 'shipping', 'subtotal', 'weee', 'discount'];
        _.forEach(totalCodes, (code: string) => {
            let exactAmount     = address.getTotalAmount(code);
            let baseExactAmount = address.getBaseTotalAmount(code);
            if (!exactAmount && !baseExactAmount)
                return true;
            let roundedAmount     = this.getCalculator().round(exactAmount + totalDelta);
            let baseRoundedAmount = this.getCalculator().round(baseExactAmount + baseTotalDelta);
            address.setTotalAmount(code, roundedAmount);
            address.setBaseTotalAmount(code, baseRoundedAmount);
            totalDelta     = exactAmount + totalDelta - roundedAmount;
            baseTotalDelta = baseExactAmount + baseTotalDelta - baseRoundedAmount;
        });
        return this;
    }

    /*
     * Ở đây tính lại tax của order có thể đã bị trừ đi discount.
     */
    collect(quote: Quote, address: Address, total: Total): Tax {
        super.collect(quote, address, total);
        this._roundingDeltas     = [];
        this._baseRoundingDeltas = [];
        this._hiddenTaxes        = [];
        address.setData('shipping_tax_amount', 0);
        address.setData('base_shipping_tax_amount', 0);

        this._store            = address.getQuote().getStore();
        let customer: Customer = address.getQuote().getCustomer();
        if (customer) {
            this.getCalculator().setCustomer(customer);
        } else {
            throw new GeneralException("Can't find customer");
        }
        if (!address.getData('applied_taxes_reset')) {
            address.setData('applied_taxes', {});
        }

        let items = address.getItems();
        if (_.size(items) == 0)
            return this;

        let request: DataObject = this.getCalculator()
                                      .getRateRequest(address, address.getQuote().getBillingAddress(), customer.getCustomerTaxClassId(), this._store);

        if (this.getTaxConfig().priceIncludesTax()) {
            if (quote.getSetting().getConfig('tax', 'cross_border_trade_enabled')) {
                this._areTaxRequestsSimilar = true;
            } else {
                this._areTaxRequestsSimilar = this.getCalculator().compareRequests(this.getCalculator().getRateOriginRequest(), request);
            }
        }

        switch (this.getTaxConfig().getAlgorithm()) {
            case Calculation.CALC_UNIT_BASE:
                this._unitBaseCalculation(address, request);
                break;
            case Calculation.CALC_ROW_BASE:
                throw new GeneralException("Not yet support algorithm: " + Calculation.CALC_ROW_BASE);
            case Calculation.CALC_TOTAL_BASE:
                throw new GeneralException("Not yet support algorithm: " + Calculation.CALC_TOTAL_BASE);
            default:
                break;
        }

        // this._addAmount(address.getData('extra_tax_amount'));
        // this._addBaseAmount(address.getData('base_extra_tax_amount'));

        this._calculateShippingTax(address, request);

        this._processHiddenTaxes();

        //round total amounts in address
        this._roundTotals(address);

        //Not logic in here.
        this.saveRealTaxForDisplayInPos(address);

        return this;
    }

    private saveRealTaxForDisplayInPos(address: Address): Tax {
        address.setData('real_tax_for_display_in_xpos',
                        address.getTotalAmount('tax') + address.getTotalAmount('hidden_tax') + address.getTotalAmount('shipping_hidden_tax'));
        address.setData('tax_only', address.getTotalAmount('tax'));
        return this;
    }

    protected _unitBaseCalculation(address: Address, taxRateRequest: DataObject): Tax {
        let items               = address.getItems();
        let itemTaxGroups       = {};
        let store               = address.getQuote().getStore();
        let catalogPriceInclTax = this.getTaxConfig().priceIncludesTax();

        _.forEach(items, (item: Item) => {
            if (item.getParentItem())
                return true;

            if (item.getHasChildren() && item.isChildrenCalculated()) {
                _.forEach(item.getChildren(), (child: Item) => {
                    this._unitBaseProcessItemTax(address, child, taxRateRequest, itemTaxGroups, catalogPriceInclTax);
                });
                this._recalculateParent(item);
            } else {
                this._unitBaseProcessItemTax(address, item, taxRateRequest, itemTaxGroups, catalogPriceInclTax);
            }
        });
        // if (address.getQuote().getData('taxes_for_items')) {
        //     itemTaxGroups = _.merge(itemTaxGroups, address.getQuote().getData('taxes_for_items'));
        // }

        // address.getQuote().setData('taxes_for_items', itemTaxGroups);
        return this;
    }

    protected _unitBaseProcessItemTax(address: Address,
                                      item: Item,
                                      taxRateRequest: DataObject,
                                      itemTaxGroups: Object,
                                      catalogPriceInclTax: boolean): void {
        taxRateRequest.setData('product_class_id', item.getProduct().getTaxClassId());
        let rate = this.getCalculator().getRate(taxRateRequest);

        item.setData('tax_amount', 0)
            .setData('base_tax_amount', 0)
            .setData('hidden_tax_amount', 0)
            .setData('base_hidden_tax_amount', 0)
            .setData('tax_percent', rate)
            .setData('discount_tax_compensation', 0);
        let rowTotalInclTax            = item.getData('row_total_incl_tax');
        let recalculateRowTotalInclTax = false;

        if (rowTotalInclTax == null) {
            // Trường hợp này thực tế phải không sảy ra bởi vì đã collect tax_subtotal trước đó rồi.
            let qty = item.getTotalQty();
            item.setData('row_total_incl_tax', this._store.roundPrice(item.getData('taxable_amount')) * qty);
            item.setData('base_row_total_incl_tax', this._store.roundPrice(item.getData('base_taxable_amount') * qty));
            recalculateRowTotalInclTax = true;
        }

        let appliedRates = this.getCalculator().getAppliedRates(taxRateRequest);
        item.setData('tax_rates', appliedRates);
        if (catalogPriceInclTax) {
            this._calcUnitTaxAmount(item, rate);
            this._saveAppliedTaxes(address, appliedRates, item.getData('tax_amount'), item.getData('base_tax_amount'), rate);
        } else {
            let taxGroups = {};
            _.forEach(appliedRates, (appliedTax: Object) => {
                let taxId   = appliedTax['id'];
                let taxRate = appliedTax['percent'];
                this._calcUnitTaxAmount(item, taxRate, taxGroups, taxId, recalculateRowTotalInclTax);
                this._saveAppliedTaxes(address, [appliedTax], taxGroups[taxId]['tax'], taxGroups[taxId]['base_tax'], taxRate);
            });
        }
        if (rate > 0) {
            // FIXME: NOT SURE
            // itemTaxGroups[item.getData('id')] = appliedRates;
        }
        this._addAmount(item.getData('tax_amount'));
        this._addBaseAmount(item.getData('base_tax_amount'));
    }

    protected  _calcUnitTaxAmount(item: Item, rate: number, taxGroups: Object = null, taxId: string = null,
                                  recalculateRowTotalInclTax: boolean = false) {
        let qty       = item.getTotalQty();
        let inclTax   = item.getData('is_price_incl_tax');
        let price     = item.getData('taxable_amount');
        let basePrice = item.getData('base_taxable_amount');
        let rateKey   = taxId == null ? rate + "" : taxId;

        let hiddenTax                 = null;
        let baseHiddenTax             = null;
        let unitTaxBeforeDiscount     = null;
        let baseUnitTaxBeforeDiscount = null;
        let unitTax                   = null;
        let baseUnitTax               = null;

        switch (this.getTaxConfig().getCalculationSequence()) {
            case Calculation.CALC_TAX_BEFORE_DISCOUNT_ON_EXCL:
            case Calculation.CALC_TAX_BEFORE_DISCOUNT_ON_INCL:
                unitTaxBeforeDiscount     = this.getCalculator().calcTaxAmount(price, rate, inclTax, false);
                baseUnitTaxBeforeDiscount = this.getCalculator().calcTaxAmount(basePrice, rate, inclTax, false);

                unitTaxBeforeDiscount = unitTax = this.getCalculator().round(unitTaxBeforeDiscount);
                baseUnitTaxBeforeDiscount = baseUnitTax = this.getCalculator().round(baseUnitTaxBeforeDiscount);
                break;
            case Calculation.CALC_TAX_AFTER_DISCOUNT_ON_EXCL:
            case Calculation.CALC_TAX_AFTER_DISCOUNT_ON_INCL:
                let discountAmount     = item.getData('discount_amount') / qty;
                let baseDiscountAmount = item.getData('base_discount_amount') / qty;

                unitTaxBeforeDiscount = this.getCalculator().calcTaxAmount(price, rate, inclTax, false);
                let unitTaxDiscount   = this.getCalculator().calcTaxAmount(discountAmount, rate, inclTax, false);
                unitTax               = this.getCalculator().round(Math.max((unitTaxBeforeDiscount - unitTaxDiscount), 0));

                baseUnitTaxBeforeDiscount = this.getCalculator().calcTaxAmount(basePrice, rate, inclTax, false);
                let baseUnitTaxDiscount   = this.getCalculator().calcTaxAmount(baseDiscountAmount, rate, inclTax, false);
                baseUnitTax               = this.getCalculator().round(Math.max((baseUnitTaxBeforeDiscount - baseUnitTaxDiscount), 0));

                unitTax     = this.getCalculator().round(unitTax);
                baseUnitTax = this.getCalculator().round(baseUnitTax);

                if (inclTax && discountAmount > 0) {
                    hiddenTax     = unitTaxBeforeDiscount - unitTax;
                    baseHiddenTax = baseUnitTaxBeforeDiscount - baseUnitTax;
                    this._hiddenTaxes.push({
                                               rate_key: rateKey,
                                               qty: qty,
                                               item: item,
                                               value: hiddenTax,
                                               base_value: baseHiddenTax,
                                               incl_tax: inclTax
                                           });
                } else if (discountAmount > price) { // case with 100% discount on price incl. tax
                    hiddenTax     = discountAmount - price;
                    baseHiddenTax = baseDiscountAmount - basePrice;
                    this._hiddenTaxes.push({
                                               rate_key: rateKey,
                                               qty: qty,
                                               item: item,
                                               value: hiddenTax,
                                               base_value: baseHiddenTax,
                                               incl_tax: inclTax
                                           });
                }
                break;
        }

        let rowTax     = this._store.roundPrice(Math.max(0, qty * unitTax));
        let baseRowTax = this._store.roundPrice(Math.max(0, qty * baseUnitTax));
        item.setData('tax_amount', item.getData('tax_amount') + rowTax);
        item.setData('base_tax_amount', item.getData('base_tax_amount') + baseRowTax);
        if (_.isObject(taxGroups)) {
            if (!taxGroups.hasOwnProperty(rateKey))
                taxGroups[rateKey] = {};
            taxGroups[rateKey]['tax']      = Math.max(0, rowTax);
            taxGroups[rateKey]['base_tax'] = Math.max(0, baseRowTax);
        }

        let rowTotalInclTax = item.getData('row_total_incl_tax');
        if (rowTotalInclTax == null || recalculateRowTotalInclTax) {
            if (this.getTaxConfig().priceIncludesTax()) {
                item.setData('row_total_incl_tax', price * qty);
                item.setData('base_row_total_incl_tax', basePrice * qty);
            } else {
                item.setData('row_total_incl_tax', item.getData('row_total_incl_tax') + unitTaxBeforeDiscount * qty);
                item.setData('base_row_total_incl_tax', item.getData('base_row_total_incl_tax') + baseUnitTaxBeforeDiscount * qty);
            }
        }
        return this;
    }


    protected _saveAppliedTaxes(address: Address, applied: any, amount: number, baseAmount: number, rate: number) {
        let previouslyAppliedTaxes = address.getData('applied_taxes');
        let process                = _.size(previouslyAppliedTaxes);

        _.forEach(applied, (row) => {
            let appliedAmount, baseAppliedAmount;
            if (row['percent'] == 0) {
                return true;
            }

            if (typeof previouslyAppliedTaxes[row['id']] == "undefined") {
                row['process']                    = process;
                row['amount']                     = 0;
                row['base_amount']                = 0;
                previouslyAppliedTaxes[row['id']] = row;
            }

            if (row.hasOwnProperty('percent') && row['percent'] != null) {
                row['percent'] = row['percent'] ? row['percent'] : 1;
                rate           = rate ? rate : 1;

                appliedAmount     = amount / rate * row['percent'];
                baseAppliedAmount = baseAmount / rate * row['percent'];
            } else {
                appliedAmount     = 0;
                baseAppliedAmount = 0;
                _.forEach(row['rates'], rate => {
                    appliedAmount += parseFloat(rate['amount'] + "");
                    baseAppliedAmount += parseFloat(rate['base_amount'] + "");
                });
            }

            if (appliedAmount || previouslyAppliedTaxes[row['id']]['amount']) {
                previouslyAppliedTaxes[row['id']]['amount'] += appliedAmount;
                previouslyAppliedTaxes[row['id']]['base_amount'] += baseAppliedAmount;
            } else {
                delete previouslyAppliedTaxes[row['id']];
            }
        });

        address.setData('applied_taxes', previouslyAppliedTaxes);
    }

    protected _recalculateParent(item: Item) {
        let rowTaxAmount     = 0;
        let baseRowTaxAmount = 0;
        _.forEach(item.getChildren, (child: Item) => {
            rowTaxAmount += child.getData('tax_amount');
            baseRowTaxAmount += child.getData('base_tax_amount');
        });
        item.setData('tax_amount', rowTaxAmount);
        item.setData('base_tax_amount', baseRowTaxAmount);
        return this;
    }

    protected _calculateShippingTax(address, taxRateRequest) {
        taxRateRequest.setData('product_class_id', this.getTaxConfig().getShippingTaxClass());
        let rate    = this.getCalculator().getRate(taxRateRequest);
        let inclTax = address.getData('is_shipping_incl_tax');

        address.setData('shipping_tax_amount', 0)
               .setData('base_shipping_tax_amount', 0)
               .setData('shipping_hidden_tax_amount', 0)
               .setData('base_shipping_hidden_tax_amount', 0);

        let appliedRates = this.getCalculator().getAppliedRates(taxRateRequest);
        if (inclTax) {
            this._calculateShippingTaxByRate(address, rate, appliedRates);
        } else {
            _.forEach(appliedRates, (appliedRate) => {
                let taxRate = appliedRate['percent'];
                let taxId   = appliedRate['id'];
                this._calculateShippingTaxByRate(address, taxRate, [appliedRate], taxId);
            });
        }
    }

    protected _calculateShippingTaxByRate(address: Address, rate: number, appliedRates: any, taxId: string = null) {
        let inclTax      = address.getData('is_shipping_incl_tax');
        let shipping     = address.getData('shipping_taxable');
        let baseShipping = address.getData('base_shipping_taxable');
        let rateKey      = taxId == null ? rate + "" : taxId;

        let hiddenTax      = null;
        let baseHiddenTax  = null;
        let tax            = null, baseTax = null;
        let discountAmount = null, baseDiscountAmount = null;
        switch (this.getTaxConfig().getCalculationSequence()) {
            case Calculation.CALC_TAX_BEFORE_DISCOUNT_ON_EXCL:
            case Calculation.CALC_TAX_BEFORE_DISCOUNT_ON_INCL:
                tax     = this.getCalculator().calcTaxAmount(shipping, rate, inclTax, false);
                baseTax = this.getCalculator().calcTaxAmount(baseShipping, rate, inclTax, false);
                break;
            case Calculation.CALC_TAX_AFTER_DISCOUNT_ON_EXCL:
            case Calculation.CALC_TAX_AFTER_DISCOUNT_ON_INCL:
                discountAmount     = address.getData('shipping_discount_amount');
                baseDiscountAmount = address.getData('base_shipping_discount_amount');
                tax                = this.getCalculator().calcTaxAmount(shipping - discountAmount, rate, inclTax, false);
                baseTax            = this.getCalculator().calcTaxAmount(baseShipping - baseDiscountAmount, rate, inclTax, false);
                break;
        }

        // calculated tax base on setting algorithm
        tax     = this.getCalculator().round(tax);
        baseTax = this.getCalculator().round(baseTax);
        this._addAmount(Math.max(0, tax));
        this._addBaseAmount(Math.max(0, baseTax));

        if (inclTax && discountAmount != null) {
            let taxBeforeDiscount     = this.getCalculator().calcTaxAmount(shipping, rate, inclTax, false);
            let baseTaxBeforeDiscount = this.getCalculator().calcTaxAmount(baseShipping, rate, inclTax, false);

            taxBeforeDiscount     = this.getCalculator().round(taxBeforeDiscount);
            baseTaxBeforeDiscount = this.getCalculator().round(baseTaxBeforeDiscount);

            hiddenTax     = Math.max(0, taxBeforeDiscount - Math.max(0, tax));
            baseHiddenTax = Math.max(0, baseTaxBeforeDiscount - Math.max(0, baseTax));
            this._hiddenTaxes.push({
                                       rate_key: rateKey,
                                       value: hiddenTax,
                                       base_value: baseHiddenTax,
                                       incl_tax: inclTax
                                   });
        }
        address.setData('shipping_tax_amount', address.getData('shipping_tax_amount') + Math.max(0, tax));
        address.setData('base_shipping_tax_amount', address.getData('base_shipping_tax_amount') + Math.max(0, baseTax));

        this._saveAppliedTaxes(address, appliedRates, tax, baseTax, rate);
    }

    protected _processHiddenTaxes() {
        // Add more hidden tax. Magento not haven't event(so must rewrite in mage1 and preference in mage2)
        let hiddenTaxesObject             = {};
        hiddenTaxesObject['hidden_taxes'] = this._hiddenTaxes;
        EventManager.dispatch("process_hidden_taxes", hiddenTaxesObject);
        this._hiddenTaxes = hiddenTaxesObject['hidden_taxes'];

        this._getAddress().setTotalAmount('hidden_tax', 0);
        this._getAddress().setBaseTotalAmount('hidden_tax', 0);
        this._getAddress().setTotalAmount('shipping_hidden_tax', 0);
        this._getAddress().setBaseTotalAmount('shipping_hidden_tax', 0);

        _.forEach(this._hiddenTaxes, taxInfoItem => {
            if (taxInfoItem.hasOwnProperty('item')) {
                // Item hidden taxes
                let item          = taxInfoItem['item'];
                let rateKey       = taxInfoItem['rate_key'];
                let hiddenTax     = taxInfoItem['value'];
                let baseHiddenTax = taxInfoItem['base_value'];
                let inclTax       = taxInfoItem['incl_tax'];
                let qty           = taxInfoItem['qty'];

                hiddenTax     = this.getCalculator().round((hiddenTax));
                baseHiddenTax = this.getCalculator().round((baseHiddenTax));
                item.setData('hidden_tax_amount', Math.max(0, qty * hiddenTax));
                item.setData('base_hidden_tax_amount', Math.max(0, qty * baseHiddenTax));
                this._getAddress().addTotalAmount('hidden_tax', item.getData('hidden_tax_amount'));
                this._getAddress().addBaseTotalAmount('hidden_tax', item.getData('base_hidden_tax_amount'));
            } else {
                // Shipping hidden taxes
                let rateKey       = taxInfoItem['rate_key'];
                let hiddenTax     = taxInfoItem['value'];
                let baseHiddenTax = taxInfoItem['base_value'];
                let inclTax       = taxInfoItem['incl_tax'];

                hiddenTax     = this.getCalculator().round(hiddenTax);
                baseHiddenTax = this.getCalculator().round(baseHiddenTax);

                this._getAddress().addTotalAmount('hidden_tax', hiddenTax);
                this._getAddress().addBaseTotalAmount('hidden_tax', baseHiddenTax);

                this._getAddress().setData('shipping_hidden_tax_amount', Math.max(0, hiddenTax));
                this._getAddress().setData('base_shipping_hidden_tax_amount', Math.max(0, baseHiddenTax));
            }
        });
    }
}