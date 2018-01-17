import {AuthGuard} from "./auth-guard";
import {NotLoggedGuard} from "./not-logged-guard";

export const routerGuardService = [
  AuthGuard,
  NotLoggedGuard
];
