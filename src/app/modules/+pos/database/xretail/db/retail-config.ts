import {DataObject} from "../../../core/framework/General/DataObject";

export class RetailConfigDB extends DataObject {
    key: string;
    value: any;

    static getFields(): string {
        return "key++,value";
    }

    static getCode(): string {
        return 'retailConfig';
    }

    static async save(key, value) {
        try {
            await window['retailDB'].retailConfig.put(value, key);
            RetailConfigDB[key] = value;
        } catch (e) {
            console.log(e);
        }
    }
}
