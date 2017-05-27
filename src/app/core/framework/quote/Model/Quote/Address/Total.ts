import {DataObject} from "../../../../General/DataObject";
import * as _ from "lodash";
export class Total extends DataObject {
    protected totalAmounts: Object     = {};
    protected baseTotalAmounts: Object = {};

    setTotalAmount(code: string, amount: number): Total {
        this.totalAmounts[code] = amount;
        if (code != 'subtotal') {
            code = code + '_amount';
        }
        this.setData(code, amount);

        return this;
    }

    setBaseTotalAmount(code: string, amount: number): Total {
        this.baseTotalAmounts[code] = amount;
        if (code != 'subtotal') {
            code = code + '_amount';
        }
        this.setData("base_" + code, amount);

        return this;
    }

    addTotalAmount(code: string, amount: number): Total {
        amount = this.getTotalAmount(code) + amount;
        this.setTotalAmount(code, amount);
        return this;
    }

    addBaseTotalAmount(code: string, amount: number): Total {
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

    setFullInfo(info: string|any[]): Total {
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
}