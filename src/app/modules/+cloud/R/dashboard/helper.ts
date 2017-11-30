export class ReportDashboardHelper {
  
  static getListScope(): Object {
    return {
      data: [
        {id: 1, label: "Outlet", value: "outlet"},
        {id: 2, label: "Magento Website", value: "magento_website"},
        {id: 3, label: "Magento Storeview", value: "magento_storeview"}
      ],
      isMultiSelect: false,
      label: "Scope",
      value: "scope"
    };
  }
  
  static getWidgets(): Object {
    return {
      data: [
        {id: 1, label: "Revenue", value: "revenue"},
        {id: 2, label: "Quantity", value: "quantity"},
        {id: 3, label: "Customer Count", value: "customer_count"},
        {id: 4, label: "Discount", value: "discount"},
        {id: 5, label: "Discount Percent", value: "discount_percent"},
        {id: 6, label: "Average Sales", value: "average_sales"}
      ],
      isMultiSelect: false,
      label: "Widgets",
      value: "widgets"
    }
  }
}
