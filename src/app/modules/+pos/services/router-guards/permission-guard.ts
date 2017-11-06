import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot} from '@angular/router';
import {PosGeneralService} from "../../R/general/general.service";
import {PosGeneralActions} from "../../R/general/general.actions";
import {posReducer} from "../../R/index";
import * as _ from 'lodash';
import {ReducerManagement} from "../../../../services/reducer-management";
import {NotifyManager} from "../../../../services/notify-manager";
import {AuthenticateService} from "../../../../services/authenticate";

@Injectable()
export class PermissionGuard implements CanActivate, CanActivateChild {
  constructor(protected authenticateService: AuthenticateService,
              protected notify: NotifyManager,
              protected generalService: PosGeneralService,
              protected generalActions: PosGeneralActions,
              protected reducerManagement: ReducerManagement) {
    this.reducerManagement.replaceReducer('posReducer', posReducer());
  }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkRolePermission(url);
  }
  
  
  checkRolePermission(url: string) {
    let values = _.split(url, '/');
    const generalData = this.generalService.resolveGeneralDataFromStorage();
    // is router setting
    if (_.indexOf(values, 'configurations') > -1) {
      if (!this.authenticateService.userCan('access_to_connectpos_settings') && url != '/pos/configurations/default/advanced/client-db') {
        this.notify.error("not_have_permission_to_access_to_connectpos_settings");
      } else if (!this.authenticateService.userCan('flush_cache') && url === '/pos/configurations/default/advanced/client-db') {
        this.notify.error("not_have_permission_to_flush_cache");
      } else {
        const baseUrl = this.generalService.getBaseUrl();
        if (baseUrl) {
          this.generalActions.selectWebsite(baseUrl);
          return true;
        } else {
          this.generalActions.goOutletRegisterPage(url);
          return false;
        }
      }
    } else {
      if (url === '/pos/default/sales/shifts' && !this.authenticateService.userCan('view_register')) {
        this.notify.error("not_have_permission_to_view_register");
      } else if (url === "/pos/default/sales/orders" && !this.authenticateService.userCan('view_order_list')) {
        this.notify.error("not_have_permission_to_view_order_list");
      } else if (url === "/pos/default/outlet-register" && !this.authenticateService.userCan('change_outlet') && generalData) {
        this.notify.error("not_have_permission_to_change_outlet");
      } else {
        return true;
      }
    }
    setTimeout(() => {
      this.generalActions.goCheckOutPage(url);
    });
    return false;
  }
  
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
