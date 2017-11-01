import {Injectable} from '@angular/core';
import {AppStorage} from "../../services/storage";
import {Observable, Subscription} from "rxjs";
import {NotifyManager} from "../../services/notify-manager";
import * as _ from 'lodash';
import {AccountActions} from "./account.actions";

@Injectable()
export class AccountService {
  
  protected subscriptionLicense: Subscription;
  
  constructor(protected storage: AppStorage,
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
  
  // subscribeLicense(resubscribe: boolean = false) {
  //   if (typeof this.subscriptionLicense === 'undefined' || resubscribe === true) {
  //     if (this.subscriptionLicense) {
  //       this.subscriptionLicense.unsubscribe();
  //     }
  //
  //     this.subscriptionLicense = Observable.combineLatest(this.licenseCollection.getCollectionObservable(), this.productCollection.getCollectionObservable())
  //                                          .subscribe(([licenseCollection, productCollection]) => {
  //                                            const products = productCollection.collection.find({}).fetch();
  //                                            if (products) {
  //                                              const posProduct = _.find(products, p => p['code'] === 'xpos');
  //                                              if (posProduct) {
  //                                                const licenses = licenseCollection.collection.find({}).fetch();
  //                                                if (_.size(licenses) === 1) {
  //                                                  this.storage.localStorage('license', _.first(licenses));
  //
  //                                                  const licenseHasPos = _.find(licenses[0]['has_product'], p => {
  //                                                    return p['product_id'] === posProduct['_id'];
  //                                                  });
  //
  //                                                  if (licenseHasPos) {
  //                                                    this.accountActions.saveLicenseData({licenseHasPos, licenses});
  //                                                  } else {
  //                                                    this.notify.error("we_can_not_find_your_license");
  //                                                  }
  //                                                } else {
  //                                                  // this.toasts.error("Can't get license information");
  //                                                  // throw new GeneralException("Can't find license");
  //                                                }
  //                                              }
  //                                            } else {
  //                                              return;
  //                                            }
  //                                          });
  //   }
  //
  //   return this.subscriptionLicense;
  // }
}
