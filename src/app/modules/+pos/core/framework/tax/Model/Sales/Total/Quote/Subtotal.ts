import {Quote} from "../../../../../quote/Model/Quote";
import {Address} from "../../../../../quote/Model/Quote/Address";
import {Total} from "../../../../../quote/Model/Quote/Address/Total";
import {CommonTaxCollector} from "./CommonTaxCollector";
import * as _ from "lodash";
import {Item} from "../../../../../quote/Model/Quote/Item";
import {DataObject} from "../../../../../General/DataObject";
import {Store} from "../../../../../store/Model/Store";
import {StoreManager} from "../../../../../store/Model/StoreManager";
import {Calculation} from "../../../Calculation";
import {GeneralException} from "../../../../../General/Exception/GeneralException";

export class Subtotal extends CommonTaxCollector {
    // checkout order sort order
    protected _totalSortOrder = 20;

    private _subtotalInclTax: number;
    private _baseSubtotalInclTax: number;
    private _subtotal: number;
    private _baseSubtotal: number;
    private _roundingDeltas: any;
    private _storeTaxRequest: DataObject;
    private _areTaxRequestsSimilar: boolean;
    private _store: Store;

    constructor() {
        super();
        this.setCode('tax_subtotal');
    }

    /*
     * Ở quote_subtotal chỉ làm nhiệm vụ đưa giá finaluế(sau khi apply các loại giá đặc biết) vào tính toán mà không quan tâm đến thuế thì ở đây
     * sẽ tính lại toàn bộ các loại giá của sản phẩm. Để đưa ra được giá không có thuế, giá có thuế. Rất rõ ràng.
     */
    collect(quote: Quote, address: Address, total: Total): Subtotal {
        this._subtotalInclTax     = 0;
        this._baseSubtotalInclTax = 0;
        this._subtotal            = 0;
        this._baseSubtotal        = 0;
        this._roundingDeltas      = {};

        address.setSubtotalInclTax(0);
        address.setBaseSubtotalInclTax(0);
        address.setTotalAmount('subtotal', 0);
        address.setBaseTotalAmount('subtotal', 0);

        let items = address.getItems();
        if (!items)
            return this;

        this._store = quote.getStore();
        this.getCalculator().setCustomer(address.getQuote().getCustomer());

        let addressRequest = this._getAddressTaxRequest(address);
        let storeRequest   = this._getStoreTaxRequest(address);

        if (quote.getSetting().getConfig('tax', 'price_includes_tax')) {
            let classIds = [];
            _.forEach(items, (item: Item) => {
                classIds.push(item.getProduct().getTaxClassId());
                if (item.getHasChildren()) {
                    _.forEach(item.getChildren(), (child: Item) => {
                        classIds.push(child.getProduct().getTaxClassId());
                    });
                }
            });
            classIds = _.uniq(classIds);
            storeRequest.setData('product_class_id', classIds);
            address.setData('product_class_id', classIds);
            if (quote.getSetting().getConfig('tax', 'cross_border_trade_enabled')) {
                this._areTaxRequestsSimilar = true;
            } else {
                this._areTaxRequestsSimilar = this._calculator.compareRequests(storeRequest, addressRequest);
            }
        }

        _.forEach(items, (item: Item) => {
            if (item.getParentItem()) {
                return true;
            }
            if (item.getHasChildren() && item.isChildrenCalculated()) {
                _.forEach(item.getChildren(), (child: Item) => {
                    this._processItem(child, addressRequest);
                });
                this._recalculateParent(item);
            } else {
                this._processItem(item, addressRequest);
            }
            this._addSubtotalAmount(address, item);
        });
        address.setData('rounding_deltas', this._roundingDeltas);
        return this;
    }

    protected _getAddressTaxRequest(address: Address) {
        return this.getCalculator().getRateRequest(address,
                                                   address.getQuote().getBillingAddress(),
                                                   address.getQuote().getCustomer().getCustomerTaxClassId(),
                                                   address.getQuote().getStore());
    }

    protected _getStoreTaxRequest(address: Address) {
        if (typeof this._storeTaxRequest == "undefined") {
            this._storeTaxRequest = this._calculator.getRateOriginRequest(address.getQuote().getStore());
        }
        return this._storeTaxRequest;
    }

    protected  _processItem(item: Item, addressRequest: DataObject): Subtotal {
        switch (this.getTaxConfig().getAlgorithm()) {

            case Calculation.CALC_UNIT_BASE:
                this._unitBaseCalculation(item, addressRequest);
                break;
            case Calculation.CALC_ROW_BASE:
                throw new GeneralException("Not yet support algorithm: " + Calculation.CALC_ROW_BASE);
            case Calculation.CALC_TOTAL_BASE:
                throw new GeneralException("Not yet support algorithm: " + Calculation.CALC_TOTAL_BASE);
            default:
                break;
        }

        return this;
    }

    /*
     * Calculate item price and row total including/excluding tax based on unit price rounding level
     * */
    protected _unitBaseCalculation(item: Item, request: DataObject): Subtotal {
        request.setData('product_class_id', item.getProduct().getTaxClassId());

        let rate        = this.getCalculator().getRate(request);
        let qty: number = item.getTotalQty();

        let price: number, basePrice: number, // là giá của sản phẩm, có thể là custom price, là giá không có thuế
            taxPrice: number, baseTaxPrice: number, // Giá đã có thuế
            subtotal: number, baseSubtotal: number, // subtotal chưa có thuế
            taxSubtotal: number, baseTaxSubtotal: number; // subtotal đã có thuế

        price = taxPrice = this.round(item.getCalculationPriceOriginal()); // lấy calculation_price
        basePrice = baseTaxPrice = this.round(item.getBaseCalculationPriceOriginal());
        subtotal = taxSubtotal = this.round(item.getData('row_total')); // lấy row total đã tính ở quote_subtotal. Nếu là catalog incl thì là Incl
        baseSubtotal = baseTaxSubtotal = this.round(item.getData('base_row_total'));

        // if we have a custom price, determine if tax should be based on the original price
        let taxOnOrigPrice: boolean = !this.getTaxConfig().applyTaxOnCustomPrice() && item.hasData('custom_price');

        let origPrice, baseOrigPrice;
        if (taxOnOrigPrice) {
            origPrice     = item.getOriginalPrice();
            baseOrigPrice = item.getBaseOriginalPrice();
        }

        item.setData('tax_percent', rate);

        let taxable: number, baseTaxable: number, // Giá để tính tax
            tax: number, baseTax: number, // Tax
            isPriceInclTax: boolean,
            storeRate: number;
        if (this.getTaxConfig().priceIncludesTax()) {
            if (this._sameRateAsStore(request)) {
                if (taxOnOrigPrice) {
                    taxable     = origPrice;
                    baseTaxable = baseOrigPrice;
                } else {
                    taxable     = price;
                    baseTaxable = basePrice;
                }

                tax             = this.getCalculator().calcTaxAmount(taxable, rate, true);
                baseTax         = this.getCalculator().calcTaxAmount(baseTaxable, rate, true);
                taxPrice        = price;
                baseTaxPrice    = basePrice;
                taxSubtotal     = subtotal;
                baseTaxSubtotal = baseSubtotal;
                price           = price - tax;
                basePrice       = basePrice - baseTax;
                subtotal        = price * qty;
                baseSubtotal    = basePrice * qty;

                isPriceInclTax = true;

                item.setData('row_tax', tax * qty);
                item.setData('base_row_tax', baseTax * qty);
            } else {
                storeRate = this.getCalculator().getStoreRate(request);
                if (taxOnOrigPrice) {
                    // the merchant already provided a customer's price that includes tax. Tức là giá nhập vào chuẩn là giá có thuế
                    taxPrice     = price;
                    baseTaxPrice = basePrice;
                    // Vì là tính thuế trên original nên sẽ lấy giá nhập vào đó để tính ra giá tính tax(taxable)
                    taxable      = this._calculatePriceInclTax(origPrice, storeRate, rate);
                    baseTaxable  = this._calculatePriceInclTax(baseOrigPrice, storeRate, rate);
                } else {
                    // determine the customer's price that includes tax.
                    taxPrice     = this._calculatePriceInclTax(price, storeRate, rate);
                    baseTaxPrice = this._calculatePriceInclTax(basePrice, storeRate, rate);
                    // Giá dùng để tính thuế:
                    taxable      = taxPrice;
                    baseTaxable  = baseTaxPrice;
                }

                tax             = this.getCalculator().calcTaxAmount(taxable, rate, true, true);
                baseTax         = this.getCalculator().calcTaxAmount(baseTaxable, rate, true, true);
                price           = taxPrice - tax;
                basePrice       = baseTaxPrice - baseTax;
                taxSubtotal     = taxPrice * qty;
                baseTaxSubtotal = baseTaxPrice * qty;
                subtotal        = price * qty;
                baseSubtotal    = basePrice * qty;

                isPriceInclTax = true;

                item.setData('row_tax', tax * qty);
                item.setData('base_row_tax', baseTax * qty);
            }
        } else {
            // determine which price to use when we calculate the tax
            if (taxOnOrigPrice) {
                taxable     = origPrice;
                baseTaxable = baseOrigPrice;
            } else {
                taxable     = price;
                baseTaxable = basePrice;
            }
            let appliedRates = this.getCalculator().getAppliedRates(request);
            let taxes        = [];
            let baseTaxes    = [];

            _.forEach(appliedRates, appliedRate => {
                let taxRate = parseFloat(appliedRate['percent']);
                taxes.push(this.getCalculator().calcTaxAmount(taxable, taxRate, false));
                baseTaxes.push(this.getCalculator().calcTaxAmount(baseTaxable, taxRate, false))
            });

            tax = 0;
            _.forEach(taxes, t => {
                tax += t;
            });
            baseTax = 0;
            _.forEach(baseTaxes, t => {
                baseTax += t;
            });
            taxPrice        = price + tax;
            baseTaxPrice    = basePrice + baseTax;
            taxSubtotal     = taxPrice * qty;
            baseTaxSubtotal = baseTaxPrice * qty;

            isPriceInclTax = false;
        }

        if (item.hasData('custom_price')) {
            /*
             * Initialize item original price before declaring custom price.
             * Bởi vì nếu set custom price vào rồi thì sẽ không lấy được giá origin.(origin lấy từ calculation mà set custom thì lại ghi đè vào đó)
             * Cái này làm đề phòng thôi vì bên quote_subtotal đã làm rồi
             */
            item.getOriginalPrice();
            item.setCustomPrice(price);
            item.setData('base_custom_price', basePrice);
        }

        /*
         * - Khi setPrice thì mất hết giá calculation_price/convert price/base calculation price vì các giá đó tính dựa vào price
         * - Tức là đến đây hủy mọi các loại giá tính toán của item.
         *
         * - Sau này muốn tính tax thì dùng giá tính tax là: taxable_amount. Giá này có thể inclTax hoặc exclTax dựa vào setting. Do đó sẽ khác nhau nếu có discount full vì nếu dùng giá excl thì sẽ =0 còn nếu dùng giá incl thì vẫn còn vần thuế.
         * - Muốn tính discount thì dùng giá: discount_calculation_price trong trường hợp là discount tax. Còn không thì sẽ không có giá này thì
         * phải lấy giá calculation_price. Mà khi lúc đó đã về null tính lại thì từ price để convert. Đó chính là lý dó tại sao ở đây lại set
         * price bằng base price.
         * 
         * - IMPORTANCE: Ở đây sẽ mất hết giá calculation nhưng lúc log ra trên xretail có bởi vì trong quote items(view) có gọi lại function get
         * calculation price
         */
        item.setPrice(basePrice)
            .setData('base_price', basePrice)
            .setData('row_total', subtotal)
            .setData('base_row_total', baseSubtotal)
            .setData('price_incl_tax', taxPrice)
            .setData('base_price_incl_tax', baseTaxPrice)
            .setData('row_total_incl_tax', taxSubtotal)
            .setData('base_row_total_incl_tax', baseTaxSubtotal)
            .setData('taxable_amount', taxable)
            .setData('base_taxable_amount', baseTaxable)
            .setData('is_price_incl_tax', isPriceInclTax);
        if (this.getTaxConfig().discountTax()) {
            /*
             Tức là giá tính discount sẽ bằng giá inclTax. Lúc tính discount sẽ ưu tiên lấy giá này trước còn không có thì sẽ lấy calculation
             price là giá không có thuể
             */
            item.setData('discount_calculation_price', taxPrice);
            item.setData('base_discount_calculation_price', baseTaxPrice);
        }

        return this;
    }

    round(price): number {
        return this._store.roundPrice(price);
    }

    protected _sameRateAsStore(request: DataObject) {
        return this._areTaxRequestsSimilar;
    }

    /*
     * Given a store price that includes tax at the store rate, this function will back out the store's tax, and add in
     * the customer's tax.  Returns this new price which is the customer's price including tax.
     * Lúc này khác rate nên cần tính được giá tính tax theo rate của customer
     * */
    protected _calculatePriceInclTax(storePriceInclTax: number, storeRate: number, customerRate: number): number {
        let storeTax     = this.getCalculator().calcTaxAmount(storePriceInclTax, storeRate, true, false);
        let priceExclTax = storePriceInclTax - storeTax;
        let customerTax  = this.getCalculator().calcTaxAmount(priceExclTax, customerRate, false, false);
        return this.getCalculator().round(priceExclTax + customerTax);
    }

    /*
     * Add row total item amount to subtotal
     * thêm subtotal vào address để tính grandtotal.
     * */
    protected _addSubtotalAmount(address: Address, item: Item) {
        if (this.getTaxConfig().priceIncludesTax()) {
            let subTotal     = item.getData('row_total_incl_tax') - item.getData('row_tax');
            let baseSubtotal = item.getData('base_row_total_incl_tax') - item.getData('base_row_tax');
            address.setTotalAmount('subtotal', address.getTotalAmount('subtotal') + subTotal);
            address.setBaseTotalAmount('subtotal', address.getBaseTotalAmount('subtotal') + baseSubtotal);
        } else {
            address.setTotalAmount('subtotal', address.getTotalAmount('subtotal') + item.getData('row_total'));
            address.setBaseTotalAmount('subtotal', address.getBaseTotalAmount('subtotal') + item.getData('base_row_total'));
        }

        address.setData('subtotal_incl_tax', address.getData('subtotal_incl_tax') + item.getData('row_total_incl_tax'));
    }

    _recalculateParent(item: Item): Subtotal {
        let rowTotal            = 0;
        let baseRowTotal        = 0;
        let rowTotalInclTax     = 0;
        let baseRowTotalInclTax = 0;
        let rowTax              = 0;
        let baseRowTax          = 0;
        let qty                 = item.getQty();
        let store               = StoreManager.getStore();

        _.forEach(item.getChildren(), (child: Item) => {
            rowTotal += child.getData('row_total');
            baseRowTotal += child.getData('base_row_total');
            rowTotalInclTax += child.getData('row_total_incl_tax');
            baseRowTotalInclTax += child.getData('base_row_total_incl_tax');
            rowTax += child.getData('row_tax');
            baseRowTax += child.getData('base_row_tax');
        });

        item.setConvertedPrice(store.roundPrice(rowTotal / qty))
            .setPrice(store.roundPrice(baseRowTotal) / qty)
            .setData('row_total', rowTotal)
            .setData('base_row_total', baseRowTotal)
            .setData('price_incl_tax', store.roundPrice(rowTotalInclTax) / qty)
            .setData('base_price_incl_tax', store.roundPrice(baseRowTotalInclTax) / qty)
            .setData('row_total_incl_tax', rowTotalInclTax)
            .setData('base_row_total_incl_tax', baseRowTotalInclTax)
            .setData('row_tax', rowTax)
            .setData('base_row_tax', baseRowTax);

        return this;

    }
}
