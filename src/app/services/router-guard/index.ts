import {AuthGuard} from "./auth-guard";
import {NotLoggedGuard} from "./not-logged-guard";
import {PermissionGuard} from "./permission-guard";

export const routerGuardService = [
  AuthGuard,
  NotLoggedGuard,
  PermissionGuard
];
