import {Routes} from "@angular/router";
import {DashboardReportComponent} from "./dashboard/dashboard.report";
import {SalesReportComponent} from "./sales/sales.report";
export const ROUTES: Routes = [
      {
        path     : 'dashboard',
        component: DashboardReportComponent
      },
      {
        path     : 'sales',
        component: SalesReportComponent
      }
];
