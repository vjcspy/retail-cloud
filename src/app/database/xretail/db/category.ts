import {DataObject} from "../../../core/framework/General/DataObject";
export class CategoryDB extends DataObject {
    id: string;
    name: string;
    parent_id: string;
    product_ids: string;
    is_active: string;
    level: string;
    position: string;
    path: string;
    image_url: string;

    static getFields(): string {
        return "id,name,parent_id,product_ids,is_active,level,position,path,image_url";
    }

    static getCode(): string {
        return "category";
    }

}