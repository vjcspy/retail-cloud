import {Injectable} from '@angular/core';
import {NotifyManager} from "../../services/notify-manager";
import {Observable, Subscription} from "rxjs";
import * as _ from 'lodash';
import {LicenseCollection} from "../../services/meteor-collections/licenses";
import {ProductCollection} from "../../services/meteor-collections/products";
import {AccountActions} from "./account.actions";
import {AppStorage} from "../../services/storage";
import {GeneralException} from "../../code/GeneralException";
import {AccountState} from "./account.state";
import {RequestService} from "../../services/request";
import {ApiManager} from "../../services/api-manager";

@Injectable()
export class AccountService {
  
  protected subscriptionLicense: Subscription;
  
  constructor(protected storage: AppStorage,
              protected requestService : RequestService,
              protected apiUrlManager: ApiManager,
              protected licenseCollection: LicenseCollection,
              protected productCollection: ProductCollection,
              protected notify: NotifyManager,
              protected accountActions: AccountActions) { }
  
  saveUserToStorage(user: any): void {
    this.storage.localStorage('userId',user['_id']);
    this.storage.localStorage('user', user);
    this.storage.localStorage('outlets', user['outlet']);
  }
  
  saveBaseUrlToStorage(baseUrl : any):void{
    this.storage.localStorage('baseUrl', baseUrl)
  }
  
  saveLicenseToStorage(): void {
    this.storage.localStorage('license', '24f247e3fda094d3d10d5eff52e310b8');
  }
  
  removeUserFromStorage() {
    this.storage.localClear('user');
  }
  
  localClear() {
   this.storage.localClear();
  }
  
  signIn(user: any, baseUrl: any): Observable<any> {
    return this.requestService.makePost(this.apiUrlManager.get('login', baseUrl), {'p1': user.username, 'p2': user.password});
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
}
