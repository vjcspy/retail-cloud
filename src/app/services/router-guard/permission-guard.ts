import {Injectable}     from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot}    from '@angular/router';
import {AuthenticateService} from "../authenticate";
import {AccountActions} from "../../R/account/account.actions";
import {NotifyManager} from "../notify-manager";
import {RouterActions} from "../../R/router/router.actions";

@Injectable()
export class PermissionGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthenticateService,
              private routerAction: RouterActions) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    
    return this.checkRolePermission(url);
  }
  
  checkRolePermission(url: string): boolean {
    if (url === '/cloud/default/dashboard' && !this.authService.userCan('access_creport_dashboard')) {
      // this.notify.error("You have not the permission to perform this action.\n" +
      //                   "Please contact your Manager if you need to achieve this\n" +
      //                   "action!");
      this.routerAction.go("cloud/default/salereport");
      return false;
    } else if (url === '/cloud/default/salereport' && !this.authService.userCan('access_creport_sale')) {
      // this.notify.error("You have not the permission to perform this action.\n" +
      //                   "Please contact your Manager if you need to achieve this\n" +
      //                   "action!");
      this.routerAction.go("cloud/default/dashboard");
      return false;
    }else{
      return true;
    }
   
    
  }
  
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
