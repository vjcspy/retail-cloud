import {DataObject} from "../../../core/framework/General/DataObject";
export class CountryDB extends DataObject {
    id: string;
    name: string;
    regions: Object[];

    static getFields(): string {
        return "id,name,regions";
    }

    static getCode(): string {
        return "countries";
    }
}