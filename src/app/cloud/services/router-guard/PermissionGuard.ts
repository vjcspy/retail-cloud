import {Injectable} from '@angular/core';
import {
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router, CanActivate
} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../ddp/auth.service";
import {ToastsManager} from "ng2-toastr";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(protected authService: AuthService,
              protected router: Router,
              protected toast: ToastsManager) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      if (this.authService.userCan('view_edit_role_permission'))
        return true;
      else{
        this.router.navigate(['']);
        this.toast.warning('You do not have permission to access this');
      }
    } else {
      this.authService.redirectUrl = state.url;
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
