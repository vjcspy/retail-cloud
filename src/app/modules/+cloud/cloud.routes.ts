import {Routes} from "@angular/router";
import {DefaultContainerComponent} from "./view/default-container.component";
import {CloudComponent} from "./cloud.component";
import {AuthGuard} from "../../services/router-guard/auth-guard";
import {UserManagementContainerComponent} from "./view/default/user-management/user-management-container.component";
import {CashiersComponent} from "./view/default/user-management/cashiers.component";
import {CashierListComponent} from "./view/default/user-management/cashiers/list.component";

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
            path: 'user-management',
            component: UserManagementContainerComponent,
            children: [
              {
                path: 'cashier',
                component: CashiersComponent,
                children: [
                  {
                    path: 'list',
                    component: CashierListComponent
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
