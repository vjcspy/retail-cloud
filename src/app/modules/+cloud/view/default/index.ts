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
];