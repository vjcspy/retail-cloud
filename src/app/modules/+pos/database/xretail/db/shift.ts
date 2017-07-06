import {DataObject} from "../../../core/framework/General/DataObject";

export class ShiftDB extends DataObject {
  id: number;
  outlet_id: string;
  register_id: string;
  user_open_id: string;
  user_close_id: string;
  user_open_name: string;
  user_close_name: string;
  open_note: string;
  close_note: string;
  data: string;
  point_earned: string;
  point_spent: string;
  total_adjustment: string;
  total_expected_amount: string;
  total_counted_amount: string;
  total_net_amount: string;
  take_out_amount: string;
  start_amount: string;
  open_at: string;
  close_at: string;
  is_open: string;
  
  static getFields(): string {
    return "id,outlet_id,register_id,user_open_id,user_close_id,user_open_name,user_close_name,open_note,close_note,data,point_earned,point_spent,total_adjustment,total_expected_amount,total_counted_amount,take_out_amount,total_net_amount,start_amount,open_at,close_at,is_open";
  }
  
  static getCode(): string {
    return 'shifts';
  }
}
