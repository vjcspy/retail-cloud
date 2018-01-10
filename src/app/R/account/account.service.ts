import {Injectable} from '@angular/core';
import {NotifyManager} from "../../services/notify-manager";
import {MeteorObservable} from "meteor-rxjs";

@Injectable()
export class AccountService {
  
  constructor(protected notify: NotifyManager) { }
  
  register(user: any) {
    return new Promise<void>((resolve, reject) => {
      Accounts.createUser({
                            username: user.username,
                            email: user.email,
                            password: user.password,
                            profile: {
                              status: 1,
                              first_name: user['firstName'],
                              last_name: user['lastName']
                            }
                          }, (err: any) => {
        if (err) {
          if (err['reason']) {
            this.notify.error(err['reason'], err['error']);
          }
          reject(err);
        } else {
          resolve();
        }
      });
      MeteorObservable.call('user.send_verification', user).subscribe(() => resolve(), (e)=>reject);
    });
  }
  
  login(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Meteor.loginWithPassword(user.username, user.password, (e: Error) => {
        if (!!e) {
          if (e['reason']) {
            this.notify.error(e['reason'], e['error']);
          }
          return reject(e);
        }
        resolve();
      });
    });
  }
  
  logout() {
    return new Promise<void>((resolve, reject) => {
      Meteor.logout((e: Error) => {
        if (!!e) {
          if (e['reason']) {
            this.notify.error(e['reason'], e['error']);
          }
          return reject(e);
        }
        resolve();
      });
    });
  }
  
  requestSendForgotPassword(email: string) {
    return new Promise<void>((resolve, reject) => {
      Accounts.forgotPassword({email}, (e) => {
        if (!e) {
          this.notify.info("A message was sent to your email");
          resolve();
        } else {
          if (e['reason']) {
            this.notify.error(e['reason'], e['error']);
          }
          return reject(e);
        }
      });
    });
  }
  
  resetPassword(token: string, newPassword: string) {
    return new Promise((resolve, reject) => {
      Accounts.resetPassword(token, newPassword, (err) => {
        if (!!err) {
          if (err['reason']) {
            this.notify.error(err['reason'], err['error']);
          }
          return reject(err);
        } else {
          this.notify.success('Password reset successfully');
          resolve();
        }
      });
    });
  }
  
  saveUserProfile(user): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('accounts.user_update_profile', user)
                      .subscribe(() => resolve(), (err) => reject(err));
    });
  }
}
