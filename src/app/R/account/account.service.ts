import {Injectable} from '@angular/core';
import {AppStorage} from "../../services/storage";
import {Observable, Subscription} from "rxjs";
import {LicenseCollection} from "../../services/meteor-collections/licenses";
import {ProductCollection} from "../../services/meteor-collections/products";
import {NotifyManager} from "../../services/notify-manager";
import * as _ from 'lodash';
import {AccountActions} from "./account.actions";
import * as Cookies from "js-cookie";

@Injectable()
export class AccountService {
  
  protected subscriptionLicense: Subscription;
  
  constructor(protected storage: AppStorage,
              protected licenseCollection: LicenseCollection,
              protected productCollection: ProductCollection,
              protected notify: NotifyManager,
              protected accountActions: AccountActions) { }
  
  saveUserToStorage(user: any): void {
    this.storage.localStorage('user', user);
  }
  
  removeUserFromStorage() {
    this.storage.localClear('user');
  }
  
  subscribeLicense(resubscribe: boolean = false) {
    if (typeof this.subscriptionLicense === 'undefined' || resubscribe === true) {
      if (this.subscriptionLicense) {
        this.subscriptionLicense.unsubscribe();
      }
      
      this.subscriptionLicense = Observable.combineLatest(this.licenseCollection.getCollectionObservable(), this.productCollection.getCollectionObservable())
                                           .subscribe(([licenseCollection, productCollection]) => {
                                             const products = productCollection.collection.find({}).fetch();
                                             if (products) {
                                               const posProduct = _.find(products, p => p['code'] === 'xpos');
                                               if (posProduct) {
                                                 const licenses = licenseCollection.collection.find({}).fetch();
                                                 if (_.size(licenses) === 1) {
                                                   this.storage.localStorage('license', _.first(licenses));
              
                                                   const licenseHasPos = _.find(licenses[0]['has_product'], p => {
                                                     return p['product_id'] === posProduct['_id'];
                                                   });
              
                                                   if (licenseHasPos) {
                                                     this.accountActions.saveLicenseData({licenseHasPos, licenses});
                                                   } else {
                                                     this.notify.error("we_can_not_find_your_license");
                                                   }
                                                 } else {
                                                   // this.toasts.error("Can't get license information");
                                                   // throw new GeneralException("Can't find license");
                                                 }
                                               }
                                             } else {
                                               return;
                                             }
                                           });
    }
    
    return this.subscriptionLicense;
  }
  
  saveVersionToCookie(): Promise<any> {
    return new Promise(((resolve) => {
      Observable.combineLatest(this.licenseCollection.getCollectionObservable(), this.productCollection.getCollectionObservable())
                .subscribe(([licenseCollection, productCollection]) => {
                  const products = productCollection.collection.find({}).fetch();
                  if (products) {
                    const posProduct = _.find(products, p => p['code'] === 'xpos');
                    if (posProduct) {
                      const licenses = licenseCollection.collection.find({}).fetch();
                      if (_.size(licenses) === 1) {
                        const licenseHasPos = _.find(licenses[0]['has_product'], p => {
                          return p['product_id'] === posProduct['_id'];
                        });
              
                        if (licenseHasPos) {
                          Cookies.set('pos_version', licenseHasPos['product_version'], {path: '/', domain: "cloud.local"});
                        }
                      }
                    }
                  }
                  resolve();
                });
    }));
  }
}
