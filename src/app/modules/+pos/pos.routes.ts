import {Routes} from "@angular/router";
import {PosComponent} from "./pos.component";
import {PosDefaultTheme} from "./view/default/default";
import {PosDefaultSalesPage} from "./view/default/sales";
import {PosDefaultSalesCheckoutComponent} from "./view/default/sales/checkout.component";
import {PosDefaultSalesOutletRegisterComponent} from "./view/default/outlet-register.component";
import {PosDefaultSalesOrdersComponent} from "./view/default/sales/orders.component";
import {PosDefaultSalesShiftsComponent} from "./view/default/sales/shifts.component";
import {AuthGuard} from "../../services/router-guard/auth-guard";
import {GeneralGuard} from "./services/router-guards/general-guard";
import {PermissionGuard} from "./services/router-guards/permission-guard";

export const POS_ROUTES: Routes = [
  {
    path: '',
    component: PosComponent,
    children: [
      {
        path: 'default',
        component: PosDefaultTheme,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'sales',
            component: PosDefaultSalesPage,
            canActivate: [GeneralGuard],
            children: [
              {path: 'checkout', component: PosDefaultSalesCheckoutComponent},
              {
                path: 'orders', component: PosDefaultSalesOrdersComponent,
                canActivate: [PermissionGuard],
                data: {preload: true, permission: "view_order_list"}
              },
              {
                path: 'shifts', component: PosDefaultSalesShiftsComponent,
                canActivate: [PermissionGuard],
                data: {preload: true, permission: "view_register"}
              },
            ]
          },
          {path: 'outlet-register', component: PosDefaultSalesOutletRegisterComponent},
        ]
      },
      {
        path: 'configurations',
        loadChildren: './modules/+configurations#ConfigurationsModule',
        canActivate: [PermissionGuard],
        data: {preload: true, permission: "access_to_connectpos_settings"}
      }
    ],
  },
];
