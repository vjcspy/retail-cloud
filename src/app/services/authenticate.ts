import {Injectable} from '@angular/core';
import {AppStorage} from "./storage";
import {MeteorObservable} from "meteor-rxjs";
import {NotifyManager} from "./notify-manager";

@Injectable()
export class AuthenticateService {
  private _user;
  protected trackingWhenUserChange;
  
  // redirect URL after login
  public redirectUrl;
  
  constructor(protected storage: AppStorage, protected notify: NotifyManager) { }
  
  get user() {
    if (typeof this.trackingWhenUserChange === 'undefined') {
      this.trackingWhenUserChange = MeteorObservable.autorun().subscribe(() => {
        this._user = Meteor.user();
        console.log(this._user);
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
  
  userCan(permission: string) {
    return true;
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
