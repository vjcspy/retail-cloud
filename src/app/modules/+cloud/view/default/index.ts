import {SidebarComponent} from "./sidebar.component";
import {HeaderComponent} from "./header.component";
import {UserManagementContainerComponent} from "./user-management/user-management-container.component";
import {CashiersComponent} from "./user-management/cashiers.component";
import {CashierListComponent} from "./user-management/cashiers/list.component";
import {CashierFormComponent} from "./user-management/cashiers/form.component";
import {LicenseManagementContainer} from "./license-management/license-management-container.component";
import {LicenseListComponent} from "./license-management/license-list.component";
import {LicenseFormComponent} from "./license-management/license-form.component";
import {ProductManagementContainerComponent} from "./product-management/container.component";
import {ProductListComponent} from "./product-management/list.component";
import {ProductFormComponent} from "./product-management/form.component";
import {PricingManagementContainerComponent} from "./pricing-managment/container.component";
import {PricingListComponent} from "./pricing-managment/list.component";
import {PricingFormComponent} from "./pricing-managment/form.component";
import {CProductContainerComponent} from "./c-product/container";
import {CProductListComponent} from "./c-product/list.component";
import {AccountContainerComponent} from "./account/container";
import {AccountLicenseContainerComponent} from "./account/license/container";
import {AccountLicenseListComponent} from "./account/license/list.component";
import {AccountLicenseAdjustComponent} from "./account/license/adjust.component";
import {AccountLicenseCheckoutComponent} from "./account/license/checkout.component";

export const CLOUD_DEFAULT_COMPONENTS = [
  SidebarComponent,
  HeaderComponent,
  
  UserManagementContainerComponent,
  CashiersComponent,
  CashierListComponent,
  CashierFormComponent,
  
  LicenseManagementContainer,
  LicenseListComponent,
  LicenseFormComponent,
  
  ProductManagementContainerComponent,
  ProductListComponent,
  ProductFormComponent,
  
  PricingManagementContainerComponent,
  PricingListComponent,
  PricingFormComponent,
  
  CProductContainerComponent,
  CProductListComponent,
  
  AccountContainerComponent,
  AccountLicenseContainerComponent,
  AccountLicenseListComponent,
  AccountLicenseAdjustComponent,
  AccountLicenseCheckoutComponent,
];
