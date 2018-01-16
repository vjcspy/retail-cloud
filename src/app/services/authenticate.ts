import {Injectable} from '@angular/core';
import {AppStorage} from "./storage";
import {MeteorObservable} from "meteor-rxjs";
import {NotifyManager} from "./notify-manager";
import {AccountActions} from "../R/account/account.actions";
import * as _ from 'lodash';
@Injectable()
export class AuthenticateService {
  private _user;
  protected trackingWhenUserChange;
  
  constructor(protected storage: AppStorage, protected notify: NotifyManager, protected accountActions: AccountActions) { }
  
  get user() {
    if (typeof this.trackingWhenUserChange === 'undefined') {
      this.trackingWhenUserChange = MeteorObservable.autorun().subscribe(() => {
        const user = Meteor.user();
        if (user) {
          this._user = user;
        }
      });
    }
    
    if (!this._user) {
      let localUser = this.storage.localRetrieve('user');
      if (localUser) {
        this._user = localUser;
      } else {
        let meteorUser = Meteor.user();
        if (meteorUser) {
          this._user = meteorUser;
        }
      }
    }
    
    return this._user;
  }
  
  set user(value) {
    this._user = value;
  }
  
  getUserName() {
    if (this.user) {
      return this.user['username'];
    }
    return '';
  }
  
  userCan(permission: string) {
    let listPermission      = this.storage.localRetrieve('permission');
    let role  = listPermission['role'];
    let permissions = listPermission['permissions'];
    if(role === "owner"){
      return true;
    }
    const currentPermission = _.find(permissions, role => {
      return role['permission'] === permission;
    });
    if (!!currentPermission) {
      return currentPermission['is_active'];
    }
    return false;
  }
  
  signIn(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      
      Meteor.loginWithPassword(user.username, user.password, (e: Error) => {
        
        if (e && e['reason']) {
          this.notify.error(e['reason'], e['error']);
          return reject(e);
        }
        resolve();
      });
    });
  }
  
  signOut() {
    return new Promise<void>((resolve, reject) => {
      Meteor.logout((e: Error) => {
        if (e && e['reason']) {
          this.notify.error(e['reason'], e['error']);
          return reject(e);
        }
        resolve();
      });
    });
  }
}
