import {Routes} from "@angular/router";
import {PageNotFound} from "./pages/404";
import {LoginComponent} from "./pages/account/login.component";
import {AccountComponent} from "./pages/account/account.component";
import {RegisterComponent} from "./pages/account/register.component";
import {LogoutComponent} from "./pages/account/logout.component";
import {ResetComponent} from "./pages/account/reset.component";
import {NotLoggedGuard} from "./services/router-guard/not-logged-guard";

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/cloud/default/',
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
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [NotLoggedGuard],
      },
      {
        path: 'reset',
        component: ResetComponent,
        canActivate: [NotLoggedGuard],
      },
      {
        path: 'reset/:token',
        component: ResetComponent,
        canActivate: [NotLoggedGuard],
      }
    ]
  },
  {path: '**', component: PageNotFound}
];
