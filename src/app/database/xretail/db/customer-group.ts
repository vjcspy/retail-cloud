import {DataObject} from "../../../core/framework/General/DataObject";
export class CustomerGroupDB extends DataObject {
    id: string;
    code: string;
    tax_class_id: string;

    static getFields(): string {
        return "id,code,tax_class_id";
    }

    static getCode(): string {
        return 'customerGroup';
    }
}