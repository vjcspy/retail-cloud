import {DataObject} from "../../../core/framework/General/DataObject";

export class PaymentDB extends DataObject {
    id: number;
    type: string;
    title: string;
    payment_data: Object;
    is_active: string;
    is_dummy: string;
    allow_amount_tendered: string;

    static getFields(): string {
        return "id,type,title,payment_data,is_active,is_dummy,allow_amount_tendered";
    }

    static getCode(): string {
        return 'payment';
    }
}
