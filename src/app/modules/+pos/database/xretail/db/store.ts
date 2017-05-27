import {db} from "./retail-db";
import * as _ from "lodash";
import {Currency} from "../../../core/framework/directory/Model/Currency";
import {DataObject} from "../../../core/framework/General/DataObject";
export class StoreDB extends DataObject {
    id: number;
    code: string;
    website_id: number;
    group_id: number;
    name: string;
    sort_order: number;
    is_active: number;
    base_currency: Currency;
    current_currency: Currency;
    rate: number;
    price_format: Object;

    static getFields(): string {
        return "id,code,website_id,group_id,name,sort_order,is_active,base_currency,current_currency,rate,price_format";
    }

    static getCode(): string {
        return 'stores';
    }

    mapWithParent(entityData: any = null): any {
        _.forEach(
            StoreDB.getFields().split(","), (key) => {
                if (entityData != null) {
                    if (key && entityData.hasOwnProperty(key)) {
                        this.setData(key, entityData[key]);
                    }
                } else {
                    if (key && this.hasOwnProperty(key))
                        this.setData(key, this[key]);
                }
            });
        return this;
    }

    async  getById(storeId: number|string): Promise<any> {
        if (storeId) {
            let storeData = await db.stores.where("id").equals(storeId + "").first();
            return this.mapWithParent(storeData);
        }
        return null;
    }
}