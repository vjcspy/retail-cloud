import {Injectable} from '@angular/core';
import {AppStorage} from "./storage";
import {MeteorObservable} from "meteor-rxjs";
import {NotifyManager} from "./notify-manager";
import {AccountActions} from "../R/account/account.actions";

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
    return true;
  }
  
  signIn(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Meteor.loginWithPassword(user.username, user.password, (e: Error) => {
        if (e && e['reason']) {
          this.notify.error(e['reason'], e['error']);
          reject(e);
        }
        resolve();
      });
    });
  }
  
  signUp(user: any) {
    return new Promise<void>((resolve, reject) => {
      Accounts.createUser({
                            username: user.username,
                            email: user.email,
                            password: user.password,
                            profile: {
                              status: 1
                            }
                          }, (err: any) => {
        if (err && err.error) {
          this.notify.error(err.reason, err.error);
          reject(err);
        } else {
          resolve();
        }
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
