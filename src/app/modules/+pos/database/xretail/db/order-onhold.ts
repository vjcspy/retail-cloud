import {DataObject} from "../../../core/framework/General/DataObject";
export class OrderOnholdDB extends DataObject {
    id: string;
    customer: Object;
    items: any[];
    data: any;
    shipping_amount: number;
    current_shipping: any;
    current_billing: any;
    note:string;
    grand_total: number;
    created_at: string;


    static getFields(): string {
        return "++id,customer,data,items,shipping_amount,current_shipping,current_billing,note,grand_total,created_at";
    }

    static getCode(): string {
        return 'orderOnhold';
    }
}
