import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import {Subscription} from "rxjs/Subscription";
import {AccountActions} from "../R/account/account.actions";
import {AppStorage} from "./storage";
import {Permission} from "./user/Permission";

@Injectable()
export class AuthenticateService {
  private _user;
  private _subscribeAccount: Subscription;
  
  constructor(protected accountActions: AccountActions, protected storage : AppStorage) {}
  
  get user() {
    let localUser = this.storage.localRetrieve('user');
    let baseUrl = this.storage.localRetrieve('baseUrl');
    if (localUser && baseUrl) {
      let accountUser = {
        'id': localUser['_id'],
        'username': localUser['username'],
        'emails': localUser['email'],
        'baseUrl': baseUrl,
        'role': localUser['role']
      }
      this._user = localUser;
      this._whenAccountUpdate(accountUser);
    }
    
    return this._user;
  }
  
  set user(value) {
    this._user = value;
  }
  
  userCan(permission: string) {
    return true;
    // let localUser        = this.storage.localRetrieve('user');
    // let activePermission = localUser['permission'];
    // if (_.indexOf(activePermission, Permission.getOrderClientStatus(permission)) != -1) {
    //   return true;
    // }
    // return false;
  }
  
  private _whenAccountUpdate(accountUser) {
    this.accountActions.loginSuccess(accountUser);
  }
}
