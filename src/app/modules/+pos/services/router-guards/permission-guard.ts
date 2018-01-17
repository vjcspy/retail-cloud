import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {AppStorage} from "../../../../services/storage";
import * as _ from 'lodash';
import {NotifyManager} from "../../../../services/notify-manager";
import {AccountActions} from "../../../../R/account/account.actions";
import {RouterActions} from "../../../../R/router/router.actions";
import {PosGeneralService} from "../../R/general/general.service";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(protected notify: NotifyManager,
              protected storage: AppStorage,
              protected accountActions: AccountActions,
              protected generalService: PosGeneralService,
              protected routerActions: RouterActions) {}
  
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let current        = route.data["permission"];
    let listPermission = this.storage.localRetrieve('permission');
    // đối với trường hợp lúc mới bắt đầu login( chưa kip nghe được permission từ meteor)
    if (!listPermission) {
      // this.storage.localClear();
      // this.accountActions.redirectLoginPage(false, false);
      this.routerActions.go('pos/default/outlet-register');
      // this.notify.error("not_have_permission_to_" + current);
      return false;
    }
    
    let role        = listPermission['role'];
    let permissions = listPermission['permissions'];
    // truong hop la shop owner
    if (role === "owner") {
      return true;
    }
    
    let cposPermission = _.find(permissions, function (p) {
      return p['permission'] === "access_to_connectpos";
    });
    
    if (!!cposPermission && cposPermission['is_active']) {
      let permission = _.find(permissions, function (p) {
        return p['permission'] === current;
      });
      if (!!permission && permission['is_active']) {
        return true;
      } else {
        const generalData = this.generalService.resolveGeneralDataFromStorage();
        if (!!generalData) {
          this.routerActions.go('pos/default/sales/checkout');
        } else {
          this.routerActions.go("pos/default/outlet-register");
        }
        this.notify.error("not_have_permission_to_" + current);
        return false;
      }
    } else {
      // this.storage.localClear();
      this.routerActions.go('pos/default/outlet-register');
      // this.notify.error("not_have_permission_to_access_to_connectpos");
      return false;
    }
    
  }
}
