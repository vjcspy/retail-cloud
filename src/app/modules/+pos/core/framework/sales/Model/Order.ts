export class Order {
  static RETAIL_ORDER_PARTIALLY_PAID_SHIPPED     = 13;
  static RETAIL_ORDER_PARTIALLY_PAID_NOT_SHIPPED = 12;
  static RETAIL_ORDER_PARTIALLY_PAID             = 11;
  
  static RETAIL_ORDER_COMPLETE_SHIPPED     = 23;
  static RETAIL_ORDER_COMPLETE_NOT_SHIPPED = 22;
  static RETAIL_ORDER_COMPLETE             = 21;
  
  static RETAIL_ORDER_PARTIALLY_REFUND_SHIPPED     = 33;
  static RETAIL_ORDER_PARTIALLY_REFUND_NOT_SHIPPED = 32;
  static RETAIL_ORDER_PARTIALLY_REFUND             = 31;
  
  static RETAIL_ORDER_FULLY_REFUND = 40;
  
  static RETAIL_ORDER_EXCHANGE_SHIPPED     = 53;
  static RETAIL_ORDER_EXCHANGE_NOT_SHIPPED = 52;
  static RETAIL_ORDER_EXCHANGE             = 51;
  
  static getOrderClientStatus(code) {
    code = parseInt(code);
    switch (code) {
      case Order.RETAIL_ORDER_PARTIALLY_PAID_SHIPPED:
        return "Partially Paid - Shipped";
      case Order.RETAIL_ORDER_PARTIALLY_PAID_NOT_SHIPPED:
        return "Partially Paid - Not Shipped";
      case Order.RETAIL_ORDER_PARTIALLY_PAID:
        return "Partially Paid";
      
      case Order.RETAIL_ORDER_COMPLETE_SHIPPED:
        return "Complete - Shipped";
      case Order.RETAIL_ORDER_COMPLETE_NOT_SHIPPED:
        return "Complete - Not Shipped";
      case Order.RETAIL_ORDER_COMPLETE:
        return "Complete";
      
      case Order.RETAIL_ORDER_PARTIALLY_REFUND_SHIPPED:
        return "Partially Refund - Shipped";
      case Order.RETAIL_ORDER_PARTIALLY_REFUND_NOT_SHIPPED:
        return "Partially Refund - Not Shipped";
      case Order.RETAIL_ORDER_PARTIALLY_REFUND:
        return "Partially Refund";
      
      case Order.RETAIL_ORDER_FULLY_REFUND:
        return "Fully Refunded";
      
      case Order.RETAIL_ORDER_EXCHANGE_SHIPPED:
        return "Exchange - Shipped";
      case Order.RETAIL_ORDER_EXCHANGE_NOT_SHIPPED:
        return "Exchange - Not Shipped";
      case Order.RETAIL_ORDER_EXCHANGE:
        return "Exchange";
      
      default:
        return "";
    }
  }
}
