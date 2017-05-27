import {AbstractTotal} from "./AbstractTotal";
import {Quote} from "../../../Quote";
import {Address} from "../../Address";
import {Total} from "../Total";
import * as _ from "lodash";
export class Grand extends AbstractTotal {
    protected _totalSortOrder = 100;

    collect(quote: Quote,
            address: Address,
            total: Total): Grand {
        let totals     = address.getAllTotalAmounts();
        let baseTotals = address.getAllBaseTotalAmounts();
        let _total     = 0;
        let _baseTotal = 0;

        _.forEach(totals, (t) => {
            _total += parseFloat(t);
        });

        _.forEach(baseTotals, (t) => {
            _baseTotal += parseFloat(t);
        });

        if (_total < 0 || _baseTotal < 0)
            _total = _baseTotal = 0;

        address.setGrandTotal(_total)
               .setBaseGrandTotal(_baseTotal);

        return this;
    }
}