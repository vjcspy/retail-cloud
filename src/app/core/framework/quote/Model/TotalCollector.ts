import {Quote} from "./Quote";
import {Total} from "./Quote/Address/Total";
import {EventManager} from "../../General/Event/EventManager";
import * as _ from "lodash";
import {Address} from "./Quote/Address";
import {TotalsCollectorList} from "./Quote/TotalsCollectorList";
import {AbstractTotal} from "./Quote/Address/Total/AbstractTotal";
export class TotalCollector {
    protected totalCollectorList: TotalsCollectorList = null;

    collect(quote: Quote): Total {
        let total: Total = new Total();

        EventManager.dispatch("sales_quote_collect_totals_before", {quote: quote});

        total.setData('subtotal', 0);
        total.setData('base_subtotal', 0);

        total.setData('subtotal_with_discount', 0);
        total.setData('base_subtotal_with_discount', 0);

        total.setData('grand_total', 0);
        total.setData('base_grand_total', 0);

        _.forEach(
            quote.getAllAddresses(), (address)=> {
                let addressTotal = this.collectAddressTotals(quote, address);

                total.setData('shipping_amount', addressTotal.getData('shipping_amount'));
                total.setData('base_shipping_amount', addressTotal.getData('base_shipping_amount'));
                total.setData('shipping_description', addressTotal.getData('shipping_description'));

                total.setData('subtotal', total.getData('subtotal') + addressTotal.getData('subtotal'));
                total.setData('base_subtotal', total.getData('base_subtotal') + addressTotal.getData('base_subtotal'));

                total.setData('sub_total_with_discount', total.getData('sub_total_with_discount') + addressTotal.getData('sub_total_with_discount'))
                total.setData(
                    'base_sub_total_with_discount',
                    total.getData('base_sub_total_with_discount') + addressTotal.getData('base_sub_total_with_discount'))

                total.setData('grand_total', total.getData('grand_total') + addressTotal.getData('grand_total'));
                total.setData('base_grand_total', total.getData('base_grand_total') + addressTotal.getData('base_grand_total'));
            });

        EventManager.dispatch("sales_quote_collect_totals_after", {quote: quote});

        return total;
    }

    collectAddressTotals(quote: Quote, address: Address): Total {
        let total = new Total();

        EventManager.dispatch(
            "sales_quote_address_collect_totals_before", {
                quote: quote,
                address: address,
                total: total
            });

        _.forEach(
            this.getCollectorList(), (collector: AbstractTotal)=> {
                collector.collect(quote, address, total);
            });

        EventManager.dispatch(
            "sales_quote_address_collect_totals_after", {
                quote: quote,
                address: address,
                total: total
            });

        address.addData(total.getData());
        address.setData('applied_taxes', total.getData('applied_taxes'));

        return total;
    }

    getCollectorList(): TotalsCollectorList {
        if (this.totalCollectorList === null) {
            this.totalCollectorList = new TotalsCollectorList();
        }
        return this.totalCollectorList;
    }
}