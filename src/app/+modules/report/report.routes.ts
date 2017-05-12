import {Routes} from "@angular/router";
import {DashboardPage} from "./pages/dashboard/dashboard";
import {ReportSalesContainer} from "./pages/sales/sales-container";
import {ReportSalesAdvancedPage} from "./pages/sales/pages/advanced";
import {ReportContainer} from "./report-container";

export const ROUTES: Routes = [
  {
    path: '',
    component: ReportContainer,
    children: [
      {
        path: '',
        component: DashboardPage
      },
      {
        path: 'dashboard',
        component: DashboardPage
      },
      {
        path: 'sales',
        component: ReportSalesContainer,
        children: [
          {
            path: '',
            component: ReportSalesAdvancedPage
          },
          {
            path: 'advanced',
            component: ReportSalesAdvancedPage
          }
        ]
      }
    ]
  },
];
