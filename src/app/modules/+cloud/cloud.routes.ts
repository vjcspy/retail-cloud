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
import {LicenseDetailsComponent} from "./view/default/license-management/license-details.component";
import {LicenseFormComponent} from "./view/default/license-management/license-form.component";
import {ProductManagementContainerComponent} from "./view/default/product-management/container.component";
import {ProductListComponent} from "./view/default/product-management/list.component";
import {ProductFormComponent} from "./view/default/product-management/form.component";
import {ProductGeneralComponent} from "./view/default/product-management/general.component";
import {ProductApiComponent} from "./view/default/product-management/api.component";
import {PricingListComponent} from "./view/default/pricing-managment/list.component";
import {PricingFormComponent} from "./view/default/pricing-managment/form.component";
import {PricingManagementContainerComponent} from "./view/default/pricing-managment/container.component";
import {CProductContainerComponent} from "./view/default/c-product/container";
import {CProductListComponent} from "./view/default/c-product/list.component";
import {AccountContainerComponent} from "./view/default/account/container";
import {AccountLicenseContainerComponent} from "./view/default/account/license/container";
import {AccountLicenseListComponent} from "./view/default/account/license/list.component";
import {AccountLicenseAdjustComponent} from "./view/default/account/license/adjust.component";
import {AccountLicenseCheckoutComponent} from "./view/default/account/license/checkout.component";
import {AccountLicensePlanListComponent} from "./view/default/account/license/plan/list.component";
import {RolesComponent} from "./view/default/user-management/roles.component";
import {PermissionComponent} from "./view/default/user-management/roles/permission.component";
import {ConnectposDocumentComponent} from "./view/default/documentation/connectpos.component";
import {ReportDocumentComponent} from "./view/default/documentation/report.component";
import {AccountLicenseCompleteComponent} from "./view/default/account/license/complete.component";
import {AccountInformationComponent} from "./view/default/account/information.component";
import {AccountLicensePlanContainerComponent} from "./view/default/account/license/plan-container.component";
import {AccountLicensePlanDetailComponent} from "./view/default/account/license/plan/detail.component";

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
              },
              {
                path: 'roles',
                component: RolesComponent
              },
              {
                path: 'permissions/:code',
                component: PermissionComponent
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
              },
              {
                path: 'detail/:id',
                component: LicenseDetailsComponent
              },
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
              {
                path: 'create',
                component: ProductGeneralComponent
              },
              {
                path: 'edit/:id',
                component: ProductGeneralComponent
              }
            ]
          },
          {
            path: "pricing",
            component: PricingManagementContainerComponent,
            children: [
              {
                path: 'list',
                component: PricingListComponent
              },
              {
                path: 'create',
                component: PricingFormComponent
              },
              {
                path: 'edit/:id',
                component: PricingFormComponent
              }
            ]
          },
          {
            path: 'c-product',
            component: CProductContainerComponent,
            children: [
              {path: 'list', component: CProductListComponent}
            ]
          },
          {
            path: 'account',
            component: AccountContainerComponent,
            children: [
              {
                path: 'license',
                component: AccountLicenseContainerComponent,
                children: [
                  {
                    path: 'list',
                    component: AccountLicenseListComponent
                  },
                  {
                    path: 'adjust/:productId',
                    component: AccountLicenseAdjustComponent
                  },
                  {
                    path: 'checkout',
                    component: AccountLicenseCheckoutComponent,
                    data: {
                      orderType: '',
                      orderId: ''
                    }
                  },
                  {
                    path: 'complete',
                    component: AccountLicenseCompleteComponent
                  },
                  {
                    path: 'plan',
                    component: AccountLicensePlanContainerComponent,
                    children: [
                      {
                        path: 'list',
                        component: AccountLicensePlanListComponent
                      },
                      {
                        path: 'detail',
                        component: AccountLicensePlanDetailComponent
                      }
                    ]
                  }
                ]
              },
              {
                path: 'information',
                component: AccountInformationComponent
              }
            ]
          },
          {
            path: 'documentation',
            children: [
              {
                path: 'connectpos',
                component: ConnectposDocumentComponent
              },
              {
                path: 'report',
                component: ReportDocumentComponent
              }
            ]
          }
        ]
      }
    ]
  }
];
