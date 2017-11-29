import * as _ from "lodash";
import * as moment from "moment";

export class DashBoardHelper {
  
  static getListTypeChart() {
    let data = [
      {id: 1, label: "Revenue", value: "revenue"},
      {id: 2, label: "Transaction Count", value: "transaction_count"},
      {id: 3, label: "Customer Count", value: "customer_count"},
      {id: 1, label: "Gross Profit", value: "gross_profit"},
      {id: 2, label: "Discount", value: "discount"},
      {id: 3, label: "Discount %", value: "discount_percent"},
      {id: 3, label: "Cart Value", value: "cart_value"},
      {id: 3, label: "Cart Size", value: "cart_size"}
    ];
    return {
      data: data,
      isMultiSelect: false,
      label: "Type Chart",
      value: "type_chart"
    }
  }
}
