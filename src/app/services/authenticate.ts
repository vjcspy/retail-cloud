import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";

@Injectable()
export class AuthenticateService {
  private _user;
  
  get user() {
    if (!this._user) {
      let meteorUser = Meteor.user();
      if (meteorUser) {
        this._user = meteorUser;
      }
    }
    
    return this._user;
  }
  
  set user(value) {
    this._user = value;
  }
}
