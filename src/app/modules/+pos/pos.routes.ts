import {Routes} from "@angular/router";
import {PosComponent} from "./pos.component";
import {PosDefaultTheme} from "./view/default/default";
import {PosDefaultSalesPage} from "./view/default/sales";
import {PosDefaultSalesCheckoutComponent} from "./view/default/sales/checkout.component";
import {PosDefaultSalesOutletRegisterComponent} from "./view/default/outlet-register.component";
import {PosDefaultSalesOrdersComponent} from "./view/default/sales/orders.component";
import {PosDefaultSalesShiftsComponent} from "./view/default/sales/shifts.component";
import {AuthGuard} from "../../services/router-guard/auth-guard";

export const POS_ROUTES: Routes = [
  {
    path: '',
    component: PosComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'default',
        component: PosDefaultTheme,
        children: [
          {
            path: 'sales',
            component: PosDefaultSalesPage,
            children: [
              {path: 'checkout', component: PosDefaultSalesCheckoutComponent},
              {path: 'orders', component: PosDefaultSalesOrdersComponent},
              {path: 'shifts', component: PosDefaultSalesShiftsComponent},
            ]
          },
          {path: 'outlet-register', component: PosDefaultSalesOutletRegisterComponent}
        ]
      }
    ]
  }
];
