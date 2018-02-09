import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {AuthenticateService} from "../authenticate";
import {RouterActions} from "../../R/router/router.actions";

@Injectable()
export class NotLoggedGuard implements CanActivate {
  constructor(protected authenticate: AuthenticateService, protected routerActions: RouterActions) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!!this.authenticate.user) {
      this.routerActions.go("");
      
      return false;
    }
    
    return true;
  }
}
