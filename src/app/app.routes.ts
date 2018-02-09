import {Routes} from "@angular/router";
import {PageNotFound} from "./pages/404";
import {LoginComponent} from "./pages/account/login.component";
import {AccountComponent} from "./pages/account/account.component";
import {NotLoggedGuard} from "./services/router-guard/not-logged-guard";

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/pos/default/sales/checkout',
    pathMatch: 'full'
  },
  {
    path: 'account',
    component: AccountComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [NotLoggedGuard],
      }
    ]
  },
  {path: '**', component: PageNotFound}
];
