import {Routes} from "@angular/router";
import {DefaultContainerComponent} from "./view/default-container.component";
import {CloudComponent} from "./cloud.component";
import {AuthGuard} from "../../services/router-guard/auth-guard";
import {CloudSaleReportPage} from "./view/report/report.component";
import {DashboardPage} from "./view/dashboard/dashboard";
import {PermissionGuard} from "../../services/router-guard/permission-guard";

export const CLOUD_ROUTES: Routes = [
  {
    path: '',
    component: CloudComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'default',
        component: DefaultContainerComponent,
        children: [
          {
            path: 'dashboard',
            component: DashboardPage,
            canActivate: [PermissionGuard]
          },
          {
            path: 'salereport',
            component: CloudSaleReportPage,
            canActivate: [PermissionGuard]
          }
        ]
      },
    ]
  }
];
