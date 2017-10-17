import {Routes} from "@angular/router";
import {DefaultContainerComponent} from "./view/default-container.component";
import {CloudComponent} from "./cloud.component";
import {AuthGuard} from "../../services/router-guard/auth-guard";
import {UserManagementContainerComponent} from "./view/default/user-management/user-management-container.component";
import {CashiersComponent} from "./view/default/user-management/cashiers.component";
import {CashierListComponent} from "./view/default/user-management/cashiers/list.component";
import {CashierFormComponent} from "./view/default/user-management/cashiers/form.component";
import {LicenseManagementContainer} from "./view/default/license-management/license-management-container.component";
import {LicenseListComponent} from "./view/default/license-management/license-list.component";
import {LicenseFormComponent} from "./view/default/license-management/license-form.component";
import {ProductManagementContainerComponent} from "./view/default/product-management/container.component";
import {ProductListComponent} from "./view/default/product-management/list.component";

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
                  },
                  {
                    path: 'edit/:id',
                    component: CashierFormComponent
                  },
                  {
                    path: 'create',
                    component: CashierFormComponent
                  }
                ]
              }
            ]
          },
          {
            path: "license",
            component: LicenseManagementContainer,
            children: [
              {
                path: 'list',
                component: LicenseListComponent
              },
              {
                path: 'create',
                component: LicenseFormComponent
              },
              {
                path: 'edit/:id',
                component: LicenseFormComponent
              }
            ]
          },
          {
            path: "product",
            component: ProductManagementContainerComponent,
            children: [
              {
                path: 'list',
                component: ProductListComponent
              },
            ]
          }
        ]
      }
    ]
  }
];
