import {DashboardComponent} from "./+modules/report/pages/dashboard/dashboard";
import {Routes} from "@angular/router";
import {ContainerComponent} from "./cloud/cloud-container/container";
import {PageNotFoundComponent} from "./cloud/pages/404/not-found";
import {AuthenticateGuard} from "./cloud/services/router-guard/authenticate";
import {LockAccountComponent} from "./cloud/pages/account/components/lock";
import {VerifyEmailComponent} from "./cloud/pages/account/components/verify";
import {ResetPasswordComponent} from "./cloud/pages/account/components/reset";
import {SignUpComponent} from "./cloud/pages/account/components/signup";
import {SignInComponent} from "./cloud/pages/account/components/signin";

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
    resolve: {
      baseUrls: AuthenticateGuard
    },
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {path: '**', component: PageNotFoundComponent}
    ]
  },
  {path: 'signin', component: SignInComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'reset_password', component: ResetPasswordComponent},
  {path: 'reset_password/:token', component: ResetPasswordComponent},
  {path: 'verify_email', component: VerifyEmailComponent},
  {path: 'verify_email/:token', component: VerifyEmailComponent},
  {path: 'lock-account', component: LockAccountComponent},
  {path: '**', component: PageNotFoundComponent}
];
