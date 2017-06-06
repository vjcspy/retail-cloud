import {Routes} from "@angular/router";
import {PageNotFound} from "./pages/404";

export const ROUTES: Routes = [
  { path: '',
    redirectTo: '/pos/default/sales/checkout',
    pathMatch: 'full'
  },
  {path: '**', component: PageNotFound}
];
