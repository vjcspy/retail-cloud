import * as _ from "lodash";
export class Format {
    getNumber(value: any) {
        if (value === null)
            return null;
        if (_.isNumber(value))
            return parseFloat(value + "");

        if (_.isString(value)) {
            let separatorComa = value.indexOf(",");
            let separatorDot  = value.indexOf(".");

            if (separatorComa > -1 && separatorDot > -1) {
                if (separatorComa > separatorDot) {
                    value = value.replace(".", "");
                    value = value.replace(",", ".");
                } else {
                    value = value.replace(",", "");
                }
            } else if (separatorComa > -1) {
                value = value.replace(",", ".");
            }

        }
        return parseFloat(value + "");
    }
}