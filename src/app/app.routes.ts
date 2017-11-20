import {Routes} from "@angular/router";
import {PageNotFound} from "./pages/404";
import {LoginComponent} from "./pages/account/login.component";
import {AccountComponent} from "./pages/account/account.component";
import {LogoutComponent} from "./pages/account/logout.component";
import {NotLoggedGuard} from "./services/router-guard/not-logged-guard";

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/cloud/default/sale-report',
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
      },
      {
        path: 'logout',
        component: LogoutComponent
      }
    ]
  },
  {path: '**', component: PageNotFound}
];
