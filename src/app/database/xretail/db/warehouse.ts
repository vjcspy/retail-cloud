import {DataObject} from "../../../core/framework/General/DataObject";

export class WarehouseDB extends DataObject {
    id: string;
    name: string;
    code: string;
    email: string;
    telephone: string;
    street: string;
    city: string;
    country_id: string;
    region: string;
    region_id: string;
    postcode: string;
    is_primary: boolean;
    additional_data: any;
    
    static getFields(): string {
        return "id,name,code,email,telephone,street,city,country_id,region,region_id,postcode,is_primary,additional_data";
    }
    
    static getCode(): string {
        return 'warehouse';
    }
}
