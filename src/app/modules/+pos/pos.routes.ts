import {Routes} from "@angular/router";
import {PosCheckoutComponent} from "./view/default/checkout.component";
import {PosComponent} from "./pos.component";
import {PosDefaultTheme} from "./view/default/default";

export const POS_ROUTES: Routes = [
  {
    path: '',
    component: PosComponent,
    children: [
      {
        path: 'default',
        component: PosDefaultTheme,
        children: [
          {path: 'checkout', component: PosCheckoutComponent}
        ]
      }
    ]
  }
];
