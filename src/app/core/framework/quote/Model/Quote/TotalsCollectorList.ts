import {Subtotal as TaxSubtotal} from "../../../tax/Model/Sales/Total/Quote/Subtotal";
import {Subtotal} from "./Address/Total/Subtotal";
import {AbstractTotal} from "./Address/Total/AbstractTotal";
import {Tax} from "../../../tax/Model/Sales/Total/Quote/Tax";
import {Shipping as TaxShipping} from "../../../tax/Model/Sales/Total/Quote/Shipping";
import {Shipping as QuoteShipping} from "./Address/Total/Shipping";
import * as _ from "lodash";
import {EventManager} from "../../../General/Event/EventManager";
import {Grand} from "./Address/Total/Grand";
export class TotalsCollectorList {
    protected _collectors: AbstractTotal[];

    getCollector(storeId: number = null): AbstractTotal[] {
        if (typeof this._collectors == "undefined") {
            this._collectors = [
                new Subtotal(),
                new TaxSubtotal(),
                new QuoteShipping(),
                new TaxShipping(),
                // Discount
                new Tax(),
                new Grand()
            ];

            let collectorObjectData = {collector: this._collectors};
            EventManager.dispatch("init_checkout_collector", collectorObjectData);
            this._collectors = collectorObjectData.collector;

            // sort
            this._collectors = _.sortBy(this._collectors, (total: AbstractTotal)=> total.getTotalSortOrder());
        }

        return this._collectors;
    }
}