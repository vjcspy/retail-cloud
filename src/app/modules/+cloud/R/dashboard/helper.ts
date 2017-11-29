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
  
}
