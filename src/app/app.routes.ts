import {DashboardComponent} from "./cloud/pages/dashboard/dashboard";
import {Routes} from "@angular/router";
import {ContainerComponent} from "./cloud/cloud-container/container";
import {PageNotFoundComponent} from "./cloud/pages/404/not-found";
import {AuthenticateGuard} from "./cloud/services/router-guard/authenticate";

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/cloud',
    pathMatch: 'full'
  },
  
  {
    path: 'cloud',
    component: ContainerComponent,
    canActivate: [AuthenticateGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {path: '**', component: PageNotFoundComponent}
    ]
  }
];
