import {DataObject} from "../../../core/framework/General/DataObject";
export class UserOrderCountDB extends DataObject {
    id: string;
    outlet_id: string;
    register_id: string;
    user_id: string;
    order_count: number;

    static getFields(): string {
        return "id,outlet_id,user_id,order_count";
    }

    static getCode(): string {
        return 'userOrderCount';
    }
}
