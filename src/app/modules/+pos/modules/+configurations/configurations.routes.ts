import {ConfigurationsComponent} from "./configurations.component";
import {ConfigurationsDefaultContainerComponent} from "./view/default/container.component";
import {AuthGuard} from "../../../../services/router-guard/auth-guard";
import {Routes} from "@angular/router";
import {ConfigurationsDefaultPosComponent} from "./view/default/pos.component";
import {ConfigurationsDefaultCacheManagement} from "./view/default/cache-management.component";
import {PosConfigurationsDefaultPosProductCategoryComponent} from "./view/default/pos/product-category.component";
import {GeneralGuard} from "../../services/router-guards/general-guard";

export const CONFIGURATIONS_ROUTES: Routes = [
  {
    path: '',
    component: ConfigurationsComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'default',
        component: ConfigurationsDefaultContainerComponent,
        canActivate: [GeneralGuard],
        children: [
          {
            path: 'pos',
            component: ConfigurationsDefaultPosComponent,
            children: [
              {path: 'product-category', component: PosConfigurationsDefaultPosProductCategoryComponent},
            ]
          },
          {path: 'cache-management', component: ConfigurationsDefaultCacheManagement},
        ]
      }
    ],
  },
];
