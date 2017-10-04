import {SidebarComponent} from "./sidebar.component";
import {HeaderComponent} from "./header.component";
import {UserManagementContainerComponent} from "./user-management/user-management-container.component";
import {CashiersComponent} from "./user-management/cashiers.component";
import {CashierListComponent} from "./user-management/cashiers/list.component";
import {CashierFormComponent} from "./user-management/cashiers/form.component";

export const CLOUD_DEFAULT_COMPONENTS = [
  SidebarComponent,
  HeaderComponent,
  
  UserManagementContainerComponent,
  CashiersComponent,
  CashierListComponent,
  CashierFormComponent
];
