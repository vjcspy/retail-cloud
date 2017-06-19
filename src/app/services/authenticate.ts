import {Injectable} from '@angular/core';

@Injectable()
export class AuthenticateService {
  private _user;
  
  constructor() { }
  
  get user() {
    return this._user;
  }
  
  set user(value) {
    this._user = value;
  }
  
  userCan(permission: string) {
    return true;
  }
  
  signOut() {
  
  }
}
