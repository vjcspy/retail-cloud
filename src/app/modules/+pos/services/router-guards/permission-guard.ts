import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {AppStorage} from "../../../../services/storage";
import * as _ from 'lodash';
import {NotifyManager} from "../../../../services/notify-manager";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(protected notify: NotifyManager, protected storage: AppStorage) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let current     = route.data["permission"];
    let listPermission      = this.storage.localRetrieve('permission');
    let role  = listPermission['role'];
    let permissions = listPermission['permissions'];
    if(role === "owner"){
      return true;
    }
    let permission  = _.find(permissions, function (p) {
      return p['permission'] === current;
    });
    
    if (!!permission && permission['is_active']) {
      return true;
    }
    this.notify.error("not_have_permission_to_" + current);
    return false;
  }
}
