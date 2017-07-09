import {ConfigurationsComponent} from "./configurations.component";
import {ConfigurationsDefaultContainerComponent} from "./view/default/container.component";
import {AuthGuard} from "../../../../services/router-guard/auth-guard";
import {Routes} from "@angular/router";
import {ConfigurationsDefaultPosComponent} from "./view/default/pos.component";
import {ConfigurationsDefaultCacheManagement} from "./view/default/cache-management.component";
import {PosConfigurationsDefaultPosProductCategoryComponent} from "./view/default/pos/product-category.component";
import {BaseUrlGuard} from "./services/router-guards/BaseUrlGuard";
import {ConfigurationsDefaultGeneralComponent} from "./view/default/general.component";
import {ConfigurationsDefaultPosCustomerComponent} from "./view/default/pos/customer.component";

export const CONFIGURATIONS_ROUTES: Routes = [
  {
    path: '',
    component: ConfigurationsComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'default',
        component: ConfigurationsDefaultContainerComponent,
        canActivate: [BaseUrlGuard],
        children: [
          {path: 'general', component: ConfigurationsDefaultGeneralComponent},
          {
            path: 'pos',
            component: ConfigurationsDefaultPosComponent,
            children: [
              {path: 'product-category', component: PosConfigurationsDefaultPosProductCategoryComponent},
              {path: 'customer', component: ConfigurationsDefaultPosCustomerComponent},
            ]
          },
          {path: 'cache-management', component: ConfigurationsDefaultCacheManagement},
        ]
      }
    ],
  },
];
