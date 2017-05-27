import {Routes} from "@angular/router";
import {PosCheckoutComponent} from "./view/default/checkout.component";
import {PosComponent} from "./pos.component";

export const POS_ROUTES: Routes = [
  {
    path: '',
    component: PosComponent,
    children: [
      {path: 'checkout', component: PosCheckoutComponent}
    ]
  }
];
