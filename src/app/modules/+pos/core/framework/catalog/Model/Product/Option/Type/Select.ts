import {DefaultType} from "./DefaultType";
import * as _ from "lodash";
import {Option} from "../../Option";
import {GeneralException} from "../../../../../General/Exception/GeneralException";
import {Value} from "../Value";

export class Select extends DefaultType {

    getOptionPrice(optionValue: string, basePrice: number): number {
        let option = this.getOption();
        let result = 0;

        if (!this._isSingleSelection()) {
            _.forEach(optionValue.split(","), value => {
                let _result: Value = option.getValueById(value);
                if (_result) {
                    result += this._getChargableOptionPrice(
                        _result.getPrice(),
                        _result.getPriceType() == 'percent',
                        basePrice
                    );
                } else {
                    throw new GeneralException(this._getWrongConfigurationMessage());
                }
            });
        } else {
            let _result: Value = option.getValueById(optionValue);
            if (_result) {
                result = this._getChargableOptionPrice(
                    _result.getPrice(),
                    _result.getPriceType() == 'percent',
                    basePrice
                )
            } else {
                throw new GeneralException(this._getWrongConfigurationMessage());
            }
        }
        return result;
    }

    protected _isSingleSelection() {
        return _.indexOf([
                             Option.OPTION_TYPE_RADIO,
                             Option.OPTION_TYPE_DROP_DOWN
                         ],
                         this.getOption().getType()) > -1;
    }

    protected _getWrongConfigurationMessage() {
        return 'Some of the selected item options are not currently available.';
    }
}
