import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import {Subscription} from "rxjs/Subscription";
import {AccountActions} from "../R/account/account.actions";

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
      const user = Meteor.user() || null;
      this._user = user;
      this._whenAccountUpdate();
    }
    
    return this._user;
  }
  
  set user(value) {
    this._user = value;
  }
  
  isAdmin(user: Object): boolean {
    return true;
  }
  
  isUser(user: Object): boolean {
    return true;
  }
  
  isShopOwner(user: Object): boolean {
    return false;
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
}
