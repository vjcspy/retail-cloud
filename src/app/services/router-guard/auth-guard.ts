import {Injectable}     from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot}    from '@angular/router';
import {RouterActions} from "../../R/router/router.actions";
import {AuthenticateService} from "../authenticate";
import {AccountActions} from "../../R/account/account.actions";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticateService, protected accountActions: AccountActions) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    
    return this.checkLogin(url);
  }
  
  checkLogin(url: string): boolean {
    if (this.authService.user) { return true; }
    
    this.accountActions.goLoginPage(url);
    return false;
  }
}
