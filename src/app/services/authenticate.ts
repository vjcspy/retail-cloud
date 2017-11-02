import {Injectable} from '@angular/core';
import {AppStorage} from "./storage";
import {NotifyManager} from "./notify-manager";
import {AccountActions} from "../R/account/account.actions";
import {ApiManager} from "./api-manager";
import {RequestService} from "./request";
import {Observable} from "rxjs";
import {Permission} from "./user/Permission";
import * as _ from 'lodash';

@Injectable()
export class AuthenticateService {
  private _user;
  
  constructor(protected storage: AppStorage,
              protected notify: NotifyManager,
              protected accountActions: AccountActions,
              private apiUrlManager: ApiManager,
              private requestService: RequestService) { }
  
  get user() {
    // let baseUrl   = this.storage.localRetrieve('baseUrl');
    // let tokenKey  = this.storage.localRetrieve('token_key');
    // let username  = this.storage.localRetrieve('username');
    let localUser = this.storage.localRetrieve('user');
    
    // if (typeof this.trackingWhenUserChange === 'undefined' && baseUrl && tokenKey && username) {
    //   let canAutoLogin            = false;
    //   this.trackingWhenUserChange = this.checkLogin(baseUrl, tokenKey, username).subscribe((data) => {
    //     return canAutoLogin = data;
    //   });
    //   if (canAutoLogin && localUser) {
    //     this._user = localUser;
    //   }
    // }
    if (localUser) {
      this._user = localUser;
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
    let localUser        = this.storage.localRetrieve('user');
    let activePermission = localUser['permission'];
    if (_.indexOf(activePermission, Permission.getOrderClientStatus(permission)) != -1) {
      return true;
    }
    return false;
  }
  
  signIn(user: any, baseUrl: any): Observable<any> {
    return this.requestService.makePost(this.apiUrlManager.get('login', baseUrl), {'p1': user.username, 'p2': user.password});
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
