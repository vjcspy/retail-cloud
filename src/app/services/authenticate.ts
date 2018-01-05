import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import {AccountActions} from "../R/account/account.actions";
import {AppStorage} from "./storage";
import {NotifyManager} from "./notify-manager";
import {GeneralException} from "../code/GeneralException";

@Injectable()
export class AuthenticateService {
  private _user;
  protected trackingWhenUserChange;
  
  constructor(protected storage: AppStorage, protected notify: NotifyManager,protected accountActions: AccountActions) {}
  
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
  
  // resolveGeneralDataFromStorage() {
  //   const outlet   = this.storage.localRetrieve('user');
  //   const baseUrl  = this.storage.localRetrieve('baseUrl');
  //
  //   let user = this.user;
  //
  //   if (!user) {
  //     throw new GeneralException("Can't find user");
  //   }
  //   user = Object.assign({}, {...user}, {id: user['_id']});
  //
  //   if (!!baseUrl) {
  //     return { baseUrl, user};
  //   } else {
  //     return null;
  //   }
  // }
}
