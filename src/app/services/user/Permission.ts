export class Permission {
  
  static access_creport_dashboard = 23;
  static access_creport_sale      = 24;
  
  static getOrderClientStatus(code) {
    switch (code) {
      case "access_creport_dashboard":
        return Permission.access_creport_dashboard;
      case "access_creport_sale":
        return Permission.access_creport_sale;
      default:
        return "";
    }
  }
}
