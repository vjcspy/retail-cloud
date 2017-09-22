import {Routes} from "@angular/router";
import {PageNotFound} from "./pages/404";
import {LoginComponent} from "./pages/account/login.component";
import {AccountComponent} from "./pages/account/account.component";
import {RegisterComponent} from "./pages/account/register.component";
import {LogoutComponent} from "./pages/account/logout.component";

export const ROUTES: Routes = [
  {
    path: 'account',
    component: AccountComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'logout',
        component: LogoutComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },
  {path: '**', component: PageNotFound}
];
