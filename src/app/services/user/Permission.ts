export class Permission {
  static access_to_connectpos_settings = 1;
  static access_to_connectpos          = 2;
  static change_outlet                 = 3;
  static flush_cache                   = 4;
  static change_register_information   = 8;
  
  static allow_using_custom_sale       = 5;
  
  static create_new_customer           = 6;
  static change_customer_information   = 7;
  
  static view_register                 = 9;
  static open_and_close_register       = 10;
  static make_adjustment_on_register   = 11;
  static print_shift_report            = 12;
  
  static create_order                  = 13;
  static custom_price                  = 14;
  static add_discount                  = 15;
  static make_shipment                 = 16;
  static view_order_list               = 17;
  static search_order                  = 18;
  static duplicate_order               = 19;
  static add_payment                   = 20;
  static print_order_detail            = 21;
  static make_refund                   = 22;
  
  static getOrderClientStatus(code) {
    switch (code) {
      case "access_to_connectpos_settings":
        return Permission.access_to_connectpos_settings;
      case "access_to_connectpos":
        return Permission.access_to_connectpos;
      case "change_outlet":
        return Permission.change_outlet;
      case "flush_cache":
        return Permission.flush_cache;
      case "change_register_information":
        return Permission.change_register_information;
      
      case "allow_using_custom_sale":
        return Permission.allow_using_custom_sale;
      
      case "create_new_customer":
        return Permission.create_new_customer;
      case "change_customer_information":
        return Permission.change_customer_information;
      
      case "view_register":
        return Permission.view_register;
      case "open_and_close_register":
        return Permission.open_and_close_register;
      case "make_adjustment_on_register":
        return Permission.make_adjustment_on_register;
      case "print_shift_report":
        return Permission.print_shift_report;
      
      case "create_order":
        return Permission.create_order;
      case "custom_price":
        return Permission.custom_price;
      case "add_discount":
        return Permission.add_discount;
      case "make_shipment":
        return Permission.make_shipment;
      case "view_order_list":
        return Permission.view_order_list;
      case "search_order":
        return Permission.search_order;
      case "duplicate_order":
        return Permission.duplicate_order;
      case "add_payment":
        return Permission.add_payment;
      case "print_order_detail":
        return Permission.print_order_detail;
      case "make_refund":
        return Permission.make_refund;
      default:
        return "";
    }
  }
}
