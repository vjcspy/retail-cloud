import {ConfigurationsDefaultContainerComponent} from "./container.component";
import {ConfigurationsDefaultPosComponent} from "./pos.component";
import {ConfigurationsDefaultCacheManagement} from "./cache-management.component";
import {PosConfigurationsDefaultPosProductCategoryComponent} from "./pos/product-category.component";
import {PosConfigurationsDefaultPosProductCategorySettingsComponent} from "./pos/product-category/settings.component";
import {ConfigurationsDefaultGeneralComponent} from "./general.component";
import {ConfigurationsDefaultPosCustomerComponent} from "./pos/customer.component";
import {ConfigurationsDefaultPosCustomerSettingsComponent} from "./pos/customer/settings.component";
import {ConfigurationsDefaultPosOutletRegisterComponent} from "./pos/outlet-register.component";
import {ConfigurationsDefaultPosOutletRegisterGridComponent} from "./pos/outlet-register/grid.component";
import {ConfigurationsDefaultPosOutletRegisterGridTableComponent} from "./pos/outlet-register/grid/table.component";
import {ConfigurationsDefaultPosOutletRegisterEditComponent} from "./pos/outlet-register/edit.component";
import {ConfigurationsDefaultPosOutletRegisterEditFormComponent} from "./pos/outlet-register/edit/form.component";
import {ConfigurationsDefaultPosOutletRegisterEditRegisterFormComponent} from "./pos/outlet-register/edit/edit-register/form.component";
import {ConfigurationsDefaultPosOutletRegisterEditRegisterComponent} from "./pos/outlet-register/edit/register.component";
import {ConfigurationsDefaultPosPaymentComponent} from "./pos/payment.component";
import {ConfigurationsDefaultPosPaymentListComponent} from "./pos/payment/list.component";
import {ConfigurationsDefaultPosCheckoutComponent} from "./pos/checkout.component";
import {ConfigurationsDEfaultPosCheckoutSettingComponent} from "./pos/checkout/setting.component";
import {ConfigurationsDefaultPosIntegrationSettingComponent} from "./pos/integration/setting.component";
import {ConfigurationsDefaultPosIntegrationComponent} from "./pos/integration.component";

export const DEFAULT_COMPONENTS = [
  ConfigurationsDefaultContainerComponent,
  
  ConfigurationsDefaultGeneralComponent,
  
  ConfigurationsDefaultPosComponent,
  PosConfigurationsDefaultPosProductCategoryComponent,
  PosConfigurationsDefaultPosProductCategorySettingsComponent,
  
  ConfigurationsDefaultPosCustomerComponent,
  ConfigurationsDefaultPosCustomerSettingsComponent,
  
  ConfigurationsDefaultPosOutletRegisterComponent,
  ConfigurationsDefaultPosOutletRegisterGridComponent,
  ConfigurationsDefaultPosOutletRegisterGridTableComponent,
  ConfigurationsDefaultPosOutletRegisterEditComponent,
  ConfigurationsDefaultPosOutletRegisterEditFormComponent,
  ConfigurationsDefaultPosOutletRegisterEditRegisterComponent,
  ConfigurationsDefaultPosOutletRegisterEditRegisterFormComponent,
  
  ConfigurationsDefaultPosPaymentComponent,
  ConfigurationsDefaultPosPaymentListComponent,
  
  ConfigurationsDefaultPosCheckoutComponent,
  ConfigurationsDEfaultPosCheckoutSettingComponent,

  ConfigurationsDefaultPosIntegrationComponent,
  ConfigurationsDefaultPosIntegrationSettingComponent,
  
  ConfigurationsDefaultCacheManagement,
];
