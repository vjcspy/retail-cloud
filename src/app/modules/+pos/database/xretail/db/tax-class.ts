import {DataObject} from "../../../core/framework/General/DataObject";
export class TaxClassDB extends DataObject {
    id: string;
    name: string;
    type: string;

    static getFields(): string {
        return "id,name,type";
    }

    static getCode(): string {
        return 'taxClass';
    }
}