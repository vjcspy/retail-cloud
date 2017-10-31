import * as _ from "lodash";
import * as moment from "moment";


export class ReportHelper {
  static REPORT_TYPE_COLUMN_ORDER = ['user','outlet','register','customer','customer_group','magento_website','magento_storeview','product','manufacturer','category','order_status','currency','day_of_week','hour','region'];
  static REPORT_TYPE_COLUMN_PRODUCT = ['product','manufacturer','category','order_status'];
  static REPORT_TYPE_COLUMN_PAYMENT = ['payment_method'];
  static REPORT_TYPE_COLUMN_SHIPPING = ['shipping_method'];
  static REPORT_TYPE_COLUMN_SUMMARY_ORDERSTATUS = ['sales_summary','order_status'];
  static REPORT_TYPE_COLUMN_DAY = ['day_of_week', 'hour'];
  static REPORT_TYPE_COLUMN_ORDERSTATUS = ['order_status'];
  
  static getListReportType(): Object {
    return {
      data: [
        {id: 1, label: "Sales Summary", value: "sales_summary"},
        {id: 2, label: "User", value: "user"},
        {id: 3, label: "Outlet", value: "outlet"},
        {id: 4, label: "Register", value: "register"},
        {id: 5, label: "Customer", value: "customer"},
        {id: 6, label: "Customer Group", value: "customer_group"},
        {id: 8, label: "Magento Website", value: "magento_website"},
        {id: 9, label: "Magento Storeview", value: "magento_storeview"},
        {id: 10, label: "Product", value: "product"},
        {id: 11, label: "Manufacturer", value: "manufacturer"},
        {id: 12, label: "Category", value: "category"},
        {id: 13, label: "Payment Method", value: "payment_method"},
        {id: 14, label: "Shipping Method", value: "shipping_method"},
        {id: 15, label: "Order Status", value: "order_status"},
        {id: 16, label: "Currency", value: "currency"},
        {id: 17, label: "Day of week", value: "day_of_week"},
        {id: 18, label: "Hour", value: "hour"},
        {id: 19, label: "Region", value: "region"},
      ],
      isMultiSelect: false,
      label: "Sale Report",
      value: "report_type"
    };
  }
  
  static getListMeasure(for_sum: boolean = false, report_type = 'sales_summary'): Object {
    let list_measure = [];
    if (for_sum) {
      if (_.indexOf(['payment_method', 'shipping_method'], report_type) == -1) {
        list_measure = [
          {id: 1, label: "Revenue", value: "revenue"},
          {id: 2, label: "Cost", value: "total_cost"},
          {id: 3, label: "Gross Profit", value: "gross_profit"},
          {id: 4, label: "Margin", value: "margin"},
          {id: 5, label: "Tax", value: "total_tax"},
          {id: 6, label: "Cart Value", value: "cart_value"},
          {id: 7, label: "Order Count", value: "order_count"},
          {id: 8, label: "Total Sales", value: "grand_total"},
        ];
      } else {
        list_measure = [
          {id: 1, label: "Total Sales", value: "grand_total"},
          {id: 2, label: "Order Count", value: "order_count"},
        ];
      }
    } else {
      list_measure = [
        {
          id: 1,
          label: "Revenue",
          value: "revenue",
          is_default: true,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING]
        },
        {
          id: 2,
          label: "Cost",
          value: "total_cost",
          is_default: true,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING]
        },
        {
          id: 3,
          label: "Gross Profit",
          value: "gross_profit",
          is_default: true,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING]
        },
        {
          id: 4,
          label: "Margin",
          value: "margin",
          is_default: true,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING]
        },
        {
          id: 5,
          label: "Tax",
          value: "total_tax",
          is_default: true,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING]
        },
        {
          id: 6,
          label: "Total Sales",
          value: "grand_total",
          is_default: true,
          not_available_for: []
        },
        {
          id: 7,
          label: "Cart Size",
          value: "cart_size",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING]
        },
        {
          id: 8,
          label: "Cart Value",
          value: "cart_value",
          is_default: true,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING]
        },
        {
          id: 9,
          label: "Cart Value (incl tax)",
          value: "cart_value_incl_tax",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING]
        },
        {
          id: 10,
          label: "Customer Count",
          value: "customer_count",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING]
        },
        {
          id: 11,
          label: "Discount",
          value: "discount_amount",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING]
        },
        {
          id: 12,
          label: "Discount percent",
          value: "discount_percent",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING]
        },
        {
          id: 13,
          label: "First Sale",
          value: "first_sale",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING,
                              ReportHelper.REPORT_TYPE_COLUMN_DAY]
        },
        {
          id: 14,
          label: "Item Sold",
          value: "item_sold",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING]
        },
        {
          id: 15,
          label: "Last Sale",
          value: "last_sale",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING,
                              ReportHelper.REPORT_TYPE_COLUMN_DAY]
        },
        {
          id: 16,
          label: "Order Count",
          value: "order_count",
          is_default: true,
          not_available_for: []
        },
        {
          id: 17,
          label: "Return percent",
          value: "return_percent",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING,
                              ReportHelper.REPORT_TYPE_COLUMN_SUMMARY_ORDERSTATUS]
        },
        {
          id: 18,
          label: "Return count",
          value: "return_count",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING,
                              ReportHelper.REPORT_TYPE_COLUMN_SUMMARY_ORDERSTATUS]
        },
        {
          id: 19,
          label: "Shipping Amount",
          value: "shipping_amount",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_ORDER]
        },
        {
          id: 20,
          label: "Shipping Tax",
          value: "shipping_tax",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_ORDER]
        },
        {
          id: 21,
          label: "Shipping Tax Refunded",
          value: "shipping_tax_refunded",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_ORDER]
        },
        {
          id: 22,
          label: "Subtotal Refunded",
          value: "subtotal_refunded",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING,
                              ReportHelper.REPORT_TYPE_COLUMN_ORDERSTATUS]
        },
        {
          id: 23,
          label: "Total Refunded",
          value: "total_refunded",
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING,
                              ReportHelper.REPORT_TYPE_COLUMN_PRODUCT]
        },
        {
          id: 24,
          label:"base_row_total_product",
          value:'base_row_total_product',
          is_default: false,
          not_available_for: [ReportHelper.REPORT_TYPE_COLUMN_PAYMENT,
                              ReportHelper.REPORT_TYPE_COLUMN_SHIPPING]
        }
      ];
    }
    return {
      data: list_measure,
      isMultiSelect: true,
      label: "Measure",
      value: "measure"
    }
  }
  
  static getListOrderStatus(): Object {
    return {
      data: [
        {id: 1, label: "ConnectPOS Partially Refund - Shipped", value: 33},
        {id: 2, label: "ConnectPOS Partially Refund - Not Shipped", value: 32},
        {id: 3, label: "ConnectPOS Partially Refund", value: 31},
        {id: 4, label: "ConnectPOS Fully Refund", value: 40},
        {id: 5, label: "ConnectPOS Exchange - Shipped", value: 53},
        {id: 6, label: "ConnectPOS Exchange - Not Shipped", value: 52},
        {id: 8, label: "ConnectPOS Exchange", value: 51},
        {id: 9, label: "ConnectPOS Complete - Shipped", value: 23},
        {id: 10, label: "ConnectPOS Complete - Not Shipped", value: 22},
        {id: 11, label: "ConnectPOS Complete", value: 21},
        {id: 12, label: "Magento Status", value: 'null'},
      ],
      isMultiSelect: true,
      label: "Order Status",
      value: "order_status"
    };
  }
  
  static getListDayOfWeek(): Object {
    return {
      data: [
        {id: 1, label: "Sunday", value: 1},
        {id: 2, label: "Monday", value: 2},
        {id: 3, label: "Tuesday", value: 3},
        {id: 4, label: "Wednesday", value: 4},
        {id: 5, label: "Thursday", value: 5},
        {id: 6, label: "Friday", value: 6},
        {id: 8, label: "Saturday", value: 7},
      ],
      isMultiSelect: true,
      label: "Day Of Week",
      value: "day_of_week"
    };
  }
  
  static getListHour(): Object {
    return {
      data: [
        {id: 1, label: "12 am - 1 am", value: 0},
        {id: 2, label: "1 am - 2 am", value: 1},
        {id: 3, label: "2 am - 3 am", value: 2},
        {id: 4, label: "3 am - 4 am", value: 3},
        {id: 5, label: "4 am - 5 am", value: 4},
        {id: 6, label: "5 am - 6 am", value: 5},
        {id: 7, label: "6 am - 7 am", value: 6},
        {id: 8, label: "7 am - 8 am", value: 7},
        {id: 9, label: "8 am - 9 am", value: 8},
        {id: 10, label: "9 am - 10 am", value: 9},
        {id: 11, label: "10 am - 11 am", value: 10},
        {id: 12, label: "11 am - 12 pm", value: 11},
        {id: 13, label: "12 pm - 1 pm", value: 12},
        {id: 14, label: "1 pm - 2 pm", value: 13},
        {id: 15, label: "2 pm - 3 pm", value: 14},
        {id: 16, label: "3 pm - 4 pm", value: 15},
        {id: 17, label: "4 pm - 5 pm", value: 16},
        {id: 18, label: "5 pm - 6 pm", value: 17},
        {id: 19, label: "6 pm - 7 pm", value: 18},
        {id: 20, label: "7 pm - 8 pm", value: 19},
        {id: 21, label: "8 pm - 9 pm", value: 20},
        {id: 22, label: "9 pm - 10 pm", value: 21},
        {id: 23, label: "10 pm - 11 pm", value: 22},
        {id: 24, label: "11 pm - 12 am", value: 23},
      ],
      isMultiSelect: true,
      label: "Hour",
      value: "hour"
    };
  }
  
}
