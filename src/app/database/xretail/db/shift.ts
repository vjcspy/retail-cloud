import {DataObject} from "../../../core/framework/General/DataObject";

export class ShiftDB extends DataObject {
    id: number;
    outlet_id: string;
    register_id: string;
    user_open_id: string;
    user_close_id: string;
    user_open_name: string;
    user_close_name: string;
    point_earned: string;
    point_spent: string;
    expected_amount: string;
    total_expected_amount: string;
    total_counted_amount: string;
    take_out_amount: string;
    left_in_amount: string;
    open_at: string;
    close_at: string;
    is_open: string;

    static getFields(): string {
        return "id,outlet_id,register_id,user_open_id,user_close_id,user_open_name,user_close_name,point_earned,point_spent,expected_amount,total_expected_amount,total_counted_amount,take_out_amount,open_at,close_at,is_open";
    }

    static getCode(): string {
        return 'shifts';
    }
}