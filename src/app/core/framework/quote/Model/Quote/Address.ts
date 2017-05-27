import {Quote} from "../Quote";
import {Item} from "./Item";
import {EventManager} from "../../../General/Event/EventManager";
import {TotalCollector} from "../TotalCollector";
import * as _ from "lodash";
import {AbstractTotal} from "./Address/Total/AbstractTotal";
import {Address as CustomerAddress} from "../../../customer/Model/Address";
export class Address extends CustomerAddress {
    static TYPE_BILLING  = 'billing';
    static TYPE_SHIPPING = 'shipping';
    protected _totalCollector: TotalCollector;
    
    getItems(): Item[] {
        return this.getQuote().getAllItems();
    }
    
    getQuote(): Quote {
        return this.getData('quote');
    }
    
    setQuote(quote: Quote): Address {
        this.setData('quote', quote);
        return this;
    }
    
    getSubtotal(): number {
        return this.getData('subtotal');
    }
    
    setSubtotal(total: number): Quote {
        return <any>this.setData('subtotal', total);
    }
    
    getBaseSubtotal(): number {
        return this.getData('base_subtotal');
    }
    
    setBaseSubtotal(total: number): Quote {
        return <any>this.setData('base_subtotal', total);
    }
    
    getGrandTotal(): number {
        return this.getData('grand_total');
    }
    
    setGrandTotal(total: number): Quote {
        return <any>this.setData('grand_total', total);
    }
    
    setSubtotalWithDiscount(total: number): Quote {
        return <any>this.setData('subtotal_with_discount', total);
    }
    
    setBaseSubtotalWithDiscount(total: number): Quote {
        return <any>this.setData('base_subtotal_with_discount', total);
    }
    
    getSubtotalWithDiscount(): number {
        return this.getData('subtotal_with_discount');
    }
    
    getBaseSubtotalWithDiscount(): number {
        return this.getData('base_subtotal_with_discount');
    }
    
    getBaseGrandTotal(): number {
        return this.getData('base_grand_total');
    }
    
    setBaseGrandTotal(total: number): Quote {
        return <any>this.setData('base_grand_total', total);
    }
    
    collectTotals(): Address {
        EventManager.dispatch("sales_quote_address_collect_totals_before", {quote: this.getQuote(), address: this});
        _.forEach(_.uniq(this.getTotalCollector().getCollectorList().getCollector()), (model: AbstractTotal) => {
            model.collect(this.getQuote(), this, null);
        });
        EventManager.dispatch("sales_quote_address_collect_totals_after", {quote: this.getQuote(), address: this});
        return this;
    }
    
    getTotalCollector(): TotalCollector {
        if (typeof this._totalCollector == "undefined") {
            this._totalCollector = new TotalCollector();
        }
        return this._totalCollector;
    }
    
    protected totalAmounts: Object     = {};
    protected baseTotalAmounts: Object = {};
    
    setTotalAmount(code: string, amount: number): Address {
        this.totalAmounts[code] = amount;
        if (code != 'subtotal') {
            code = code + '_amount';
        }
        this.setData(code, amount);
        
        return this;
    }
    
    setBaseTotalAmount(code: string, amount: number): Address {
        this.baseTotalAmounts[code] = amount;
        if (code != 'subtotal') {
            code = code + '_amount';
        }
        this.setData("base_" + code, amount);
        
        return this;
    }
    
    addTotalAmount(code: string, amount: number): Address {
        amount = this.getTotalAmount(code) + amount;
        this.setTotalAmount(code, amount);
        return this;
    }
    
    addBaseTotalAmount(code: string, amount: number): Address {
        amount = this.getBaseTotalAmount(code) + amount;
        this.setBaseTotalAmount(code, amount);
        return this;
    }
    
    getTotalAmount(code): number {
        if (this.totalAmounts.hasOwnProperty(code)) {
            return this.totalAmounts[code];
        }
        return 0;
    }
    
    getBaseTotalAmount(code): number {
        if (this.baseTotalAmounts.hasOwnProperty(code)) {
            return this.baseTotalAmounts[code];
        }
        return 0;
    }
    
    getAllTotalAmounts(): Object {
        return this.totalAmounts;
    }
    
    getAllBaseTotalAmounts(): Object {
        return this.baseTotalAmounts;
    }
    
    setFullInfo(info: string | any[]): Address {
        this.setData('full_info', info);
        return this;
    }
    
    getFullInfo(): Object {
        let fullInfo = this.getData('full_info');
        if (_.isString(fullInfo)) {
            fullInfo = JSON.parse(fullInfo);
        }
        return fullInfo;
    }
    
    setSubtotalInclTax(v: number): Address {
        return <any>this.setData('subtotal_incl_tax', v);
    }
    
    setBaseSubtotalInclTax(v: number): Address {
        return <any>this.setData('base_subtotal_incl_tax', v);
    }
    
}
