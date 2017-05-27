import {DataObject} from "../../../core/framework/General/DataObject";
export class ReceiptDB extends DataObject {
    id: string;
    logo_url: string;
    footer_url: string;
    header: string;
    footer: string;
    customer_info: string;
    font_type: string;
    barcode_symbology: string;
    row_total_incl_tax: string;
    subtotal_incl_tax: string;
    enable_barcode: string;
    enable_power_text: string;
    order_info: string;
    is_default : string;


    static getFields(): string {
        return "++id,logo_url,footer_url,header,footer,customer_info,font_type,barcode_symbology,row_total_incl_tax,subtotal_incl_tax,enable_barcode,enable_power_text,order_info,is_default";
    }

    static getCode(): string {
        return 'receipts';
    }
}
