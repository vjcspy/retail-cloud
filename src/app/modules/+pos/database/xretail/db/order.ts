import {DataObject} from "../../../core/framework/General/DataObject";
export class OrderDB extends DataObject {
  id: string;
  order_id: string;
  status: string;
  increment_id: string;
  retail_id: string;
  retail_note: string;
  retail_status: string;
  can_creditmemo: string;
  can_ship: string;
  can_invoice: string;
  sync_data: any;
  pushed: number; // 0: not pushed, 1: pushed success, 3: pushed failed
  customer: Object;
  items: any[];
  billing_address: Object;
  shipping_address: Object;
  totals: Object;
  created_at: string;
  
  static getFields(): string {
    return "++id,order_id,increment_id,status,retail_id,retail_status,retail_note,sync_data,pushed,can_creditmemo,can_ship,can_invoice,customer,items,billing_address,shipping_address,totals";
  }
  
  static getCode(): string {
    return 'orders';
  }
}
