import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";

@Injectable()
export class AuthenticateService {
  private _user;
  protected trackingWhenUserChange;
  
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
      let meteorUser = Meteor.user();
      if (meteorUser) {
        this._user = meteorUser;
      }
    }
    
    return this._user;
  }
}
