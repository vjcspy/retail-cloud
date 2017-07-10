import {ConfigurationsDefaultContainerComponent} from "./container.component";
import {ConfigurationsDefaultPosComponent} from "./pos.component";
import {ConfigurationsDefaultCacheManagement} from "./cache-management.component";
import {PosConfigurationsDefaultPosProductCategoryComponent} from "./pos/product-category.component";
import {PosConfigurationsDefaultPosProductCategorySettingsComponent} from "./pos/product-category/settings.component";
import {ConfigurationsDefaultGeneralComponent} from "./general.component";
import {ConfigurationsDefaultPosCustomerComponent} from "./pos/customer.component";
import {ConfigurationsDefaultPosCustomerSettingsComponent} from "./pos/customer/settings.component";

export const DEFAULT_COMPONENTS = [
  ConfigurationsDefaultContainerComponent,
  
  ConfigurationsDefaultGeneralComponent,
  
  ConfigurationsDefaultPosComponent,
  PosConfigurationsDefaultPosProductCategoryComponent,
  PosConfigurationsDefaultPosProductCategorySettingsComponent,
  
  ConfigurationsDefaultPosCustomerComponent,
  ConfigurationsDefaultPosCustomerSettingsComponent,
  
  ConfigurationsDefaultCacheManagement
];