import {Routes} from "@angular/router";
import {PosComponent} from "./pos.component";
import {PosDefaultTheme} from "./view/default/default";
import {PosDefaultSalesPage} from "./view/default/sales";
import {PosDefaultSalesCheckoutComponent} from "./view/default/sales/checkout.component";
import {PosDefaultSalesOutletRegisterComponent} from "./view/default/outlet-register.component";

export const POS_ROUTES: Routes = [
  {
    path: '',
    component: PosComponent,
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
              {path: 'order-list', component: PosDefaultSalesCheckoutComponent},
              {path: 'shift', component: PosDefaultSalesCheckoutComponent},
            ]
          },
          {path: 'outlet-register', component: PosDefaultSalesOutletRegisterComponent}
        ]
      }
    ]
  }
];
