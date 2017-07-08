import {ConfigurationsComponent} from "./configurations.component";
import {ConfigurationsDefaultContainerComponent} from "./view/default/container.component";
import {AuthGuard} from "../../../../services/router-guard/auth-guard";
import {Routes} from "@angular/router";
import {ConfigurationsDefaultPosComponent} from "./view/default/pos.component";
import {ConfigurationsDefaultCacheManagement} from "./view/default/cache-management.component";

export const CONFIGURATIONS_ROUTES: Routes = [
  {
    path: '',
    component: ConfigurationsComponent,
    children: [
      {
        path: 'default',
        component: ConfigurationsDefaultContainerComponent,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'pos',
            component: ConfigurationsDefaultPosComponent,
            // children: [
            //   {path: 'checkout', component: PosDefaultSalesCheckoutComponent},
            // ]
          },
          {path: 'cache-management', component: ConfigurationsDefaultCacheManagement},
        ]
      }
    ],
  },
];
