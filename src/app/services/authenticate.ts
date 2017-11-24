import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import {Subscription} from "rxjs/Subscription";
import {AccountActions} from "../R/account/account.actions";
import {LogicException} from "../code/LogicException";
import * as _ from 'lodash';

@Injectable()
export class AuthenticateService {
  private _user;
  private _subscribeAccount: Subscription;
  
  static SUPERADMIN = "super_admin";
  static ADMIN      = "admin";
  static SALES      = "sales";
  static AGENCY     = "agency";
  static USER       = "user";
  
  constructor(protected accountActions: AccountActions) {}
  
  get user() {
    if (typeof this._user === 'undefined') {
      this._user = Meteor.user() || null;
      this._whenAccountUpdate();
    }
    
    return this._user;
  }
  
  set user(value) {
    this._user = value;
  }
  
  isAdmin(user: Object): boolean {
    if (!user) {
      user = this.user;
    }
    return !!user && _.size(_.intersection(this.getRole(user, 'cloud_group'), ['super_admin', 'sales', 'agency'])) > 0;
  }
  
  isUser(user: Object): boolean {
    if (!user) {
      user = this.user;
    }
    return !!user && _.size(_.intersection(this.getRole(user, 'cloud_group'), ['user'])) > 0;
  }
  
  isShopOwner(user: Object): boolean {
    if (!user) {
      user = this.user;
    }
    console.log(user);
    return !!user && _.isArray(user['has_license']) && _.size(user['has_license']) > 0 && user['has_license'][0]['license_permission'] === 'owner';
  }
  
  userCan(permission: string) {
    return true;
  }
  
  subscribeAccountChange() {
    if (typeof this._subscribeAccount === 'undefined') {
      MeteorObservable.autorun().subscribe(() => {
        this.user = Meteor.user();
        this._whenAccountUpdate();
      });
    }
  }
  
  private _whenAccountUpdate() {
    this.accountActions.saveAccount(this.user);
  }
  
  getRole(user: Object, group: string): string[] {
    if (!!user && user.hasOwnProperty('roles')) {
      return user['roles'].hasOwnProperty(group) ? user['roles'][group] : [];
    }
    
    throw new LogicException('user must have role');
  }
}
