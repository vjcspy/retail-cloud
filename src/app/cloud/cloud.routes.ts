import {Routes} from "@angular/router";
import {SignInPage} from "./pages/account/signin";
import {SignUpPage} from "./pages/account/signup";
import {ResetPasswordPage} from "./pages/account/reset";
import {LockAccountPage} from "./pages/account/lock";

export const ROUTES: Routes = [
  {path: 'signin', component: SignInPage},
  {path: 'signup', component: SignUpPage},
  {path: 'reset_password', component: ResetPasswordPage},
  {path: 'reset_password/:token', component: ResetPasswordPage},
  {path: 'lock-account', component: LockAccountPage}
];
