import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot} from '@angular/router';
import {AuthenticateService} from "../authenticate";
import {AccountActions} from "../../R/account/account.actions";
import {TrackingService} from "../tracking/tracking-service";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthenticateService, protected accountActions: AccountActions, protected trackingService: TrackingService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authService.user) {
      this.trackingService.loginTracking();
      return true;
    }

    this.accountActions.goLoginPage(url);
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
