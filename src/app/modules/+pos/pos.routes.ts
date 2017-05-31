import {Routes} from "@angular/router";
import {PosComponent} from "./pos.component";
import {PosDefaultTheme} from "./view/default/default";
import {PosDefaultCheckoutPage} from "./view/default/checkout";

export const POS_ROUTES: Routes = [
  {
    path: '',
    component: PosComponent,
    children: [
      {
        path: 'default',
        component: PosDefaultTheme,
        children: [
          {path: 'checkout', component: PosDefaultCheckoutPage}
        ]
      }
    ]
  }
];
