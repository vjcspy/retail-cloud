import {ConfigurationsDefaultContainerComponent} from "./container.component";
import {ConfigurationsDefaultPosComponent} from "./pos.component";
import {ConfigurationsDefaultCacheManagement} from "./cache-management.component";
import {PosConfigurationsDefaultPosProductCategoryComponent} from "./pos/product-category.component";
import {PosConfigurationsDefaultPosProductCategorySettingsComponent} from "./pos/product-category/settings.component";

export const DEFAULT_COMPONENTS = [
  ConfigurationsDefaultContainerComponent,
  
  ConfigurationsDefaultPosComponent,
  PosConfigurationsDefaultPosProductCategoryComponent,
  PosConfigurationsDefaultPosProductCategorySettingsComponent,
  
  ConfigurationsDefaultCacheManagement
];
