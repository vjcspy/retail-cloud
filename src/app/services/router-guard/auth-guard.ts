import {Injectable}     from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot}    from '@angular/router';
import {RouterActions} from "../../R/router/router.actions";
import {AuthenticateService} from "../authenticate";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticateService, private routerActions: RouterActions) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    
    return this.checkLogin(url);
  }
  
  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn()) { return true; }
    
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
    
    // Navigate to the login page with extras
    this.routerActions.go('account/login');
    return false;
  }
}
