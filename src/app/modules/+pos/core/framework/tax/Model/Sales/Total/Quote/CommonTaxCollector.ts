import {AbstractTotal} from "../../../../../quote/Model/Quote/Address/Total/AbstractTotal";
import {TaxConfig} from "../../../TaxConfig";
import {Calculation} from "../../../Calculation";
export class CommonTaxCollector extends AbstractTotal {
    protected _calculator: Calculation;

    getTaxConfig(): TaxConfig {
        return new TaxConfig();
    }

    getCalculator(): Calculation {
        if (typeof this._calculator == "undefined") {
            this._calculator = new Calculation();
        }
        return this._calculator;
    }

}