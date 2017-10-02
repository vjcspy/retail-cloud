import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import {Subscription} from "rxjs/Subscription";
import {AccountActions} from "../R/account/account.actions";

@Injectable()
export class AuthenticateService {
  private _user;
  private _subscribeAccount: Subscription;
  
  constructor(protected accountActions: AccountActions) {}
  
  get user() {
    if (typeof this._user === 'undefined') {
      this._user = Meteor.user();
      this._whenAccountUpdate();
    }
    
    return this._user;
  }
  
  set user(value) {
    this._user = value;
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
