import {Injectable} from '@angular/core';
import {AppStorage} from "../../services/storage";
import {Observable, Subscription} from "rxjs";
import {LicenseCollection} from "../../services/meteor-collections/licenses";
import {ProductCollection} from "../../services/meteor-collections/products";
import {NotifyManager} from "../../services/notify-manager";
import * as _ from 'lodash';
import {AccountActions} from "./account.actions";
import {UserCollection} from "../../services/meteor-collections/users";
import * as Cookies from "js-cookie";

@Injectable()
export class AccountService {
  
  protected subscriptionLicense: Subscription;
  
  protected subscriptionPermission: Subscription;
  
  protected subscriptionVersion: Subscription;
  
  constructor(protected storage: AppStorage,
              protected licenseCollection: LicenseCollection,
              protected productCollection: ProductCollection,
              protected userCollection: UserCollection,
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
      
      this.subscriptionLicense =
        Observable.combineLatest(this.licenseCollection.getCollectionObservable(), this.productCollection.getCollectionObservable())
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
  
  subscribePermission(resubscribe: boolean = false) {
    if (typeof this.subscriptionPermission === 'undefined' || resubscribe === true) {
      if (this.subscriptionPermission) {
        this.subscriptionPermission.unsubscribe();
      }
      this.subscriptionPermission =
        Observable.combineLatest(this.licenseCollection.getCollectionObservable(), this.userCollection.getCollectionObservable())
                  .subscribe(([licenseCollection, userCollection]) => {
                    // subscribe role permission :
                    const users       = userCollection.collection.find({}).fetch();
                    // let storageUser   = this.storage.localRetrieve('user');
                    let storageUser   = Meteor.user();
                    const currentUser = _.find(users, u => u['username'] === storageUser['username']);
                    if (currentUser) {
                      const licenses = licenseCollection.collection.find({}).fetch();
                      if (_.size(licenses) === 1) {
                        const licenseHasRole = _.find(licenses[0]['has_roles'], role => {
                          return role['code'] === currentUser['has_license'][0]['shop_role'];
                        });
                        let permissions: any;
                        let cposPermission: boolean;
                        if (licenseHasRole || currentUser['has_license'][0]['license_permission'] === "owner") {
                          // truong hop current user la shop owner
                          if (typeof licenseHasRole === 'undefined') {
                            permissions    = {};
                            cposPermission = true;
                          } else {
                            permissions    = licenseHasRole['has_permissions'];
                            let accessCPOS = _.find(permissions, role => {
                              return role['permission'] == "access_to_connectpos";
                            });
                            if (!!accessCPOS) {
                              cposPermission = accessCPOS['is_active'];
                            } else {
                              cposPermission = false;
                            }
                          }
                        } else {
                          permissions    = {};
                          cposPermission = false;
                          // this.notify.error("we_can_not_find_your_role_permission");
                        }
                        this.accountActions.checkCposPermission({cposPermission});
                        this.storage.localStorage('permission',
                                                  {"role": currentUser['has_license'][0]['license_permission'], "permissions": permissions});
                        // if (licenseHasRole || currentUser['has_license'][0]['license_permission'] === "owner") {
                        //   let permission = {
                        //     "role": currentUser['has_license'][0]['license_permission'],
                        //     'permission': licenseHasRole['has_permissions']
                        //   };
                        //   this.storage.localStorage('permission',permission);
                        //   // this.accountActions.saveLicenseData({licenseHasPos, licenses});
                        // } else {
                        //   this.notify.error("we_can_not_find_your_role_permission");
                        // }
                      }
            
                    } else {
                      this.notify.error("Can't get user information");
                    }
                  });
    }
    
    return this.subscriptionPermission;
  }
  
  subscribeVersion(resubscribe: boolean = false, apiVersion: string = null) {
    if (typeof this.subscriptionVersion === 'undefined' || resubscribe === true) {
      if (this.subscriptionVersion) {
        this.subscriptionVersion.unsubscribe();
      }
      
      this.subscriptionVersion = Observable.combineLatest(this.productCollection.getCollectionObservable())
                                           .subscribe(([productCollection]) => {
                                             const products = productCollection.collection.find({}).fetch();
                                             if (products) {
                                               const posProduct = _.find(products, p => p['code'] === 'xpos');
                                               if (posProduct) {
                                                 if (apiVersion != null) {
                                                   let checkVersion = _.find(posProduct['versions'], v => v['version'] === apiVersion);
                                                   console.log(checkVersion);
                                                   if (!checkVersion) {
                                                     this.notify.warning("connectpos_version_not_compat_api_version");
                                                   }
                                                 } else {
                                                   this.notify.warning("connectpos_version_not_compat_api_version");
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
                          Cookies.set('pos_version', licenseHasPos['product_version'], {path: '/', /*domain: "cloud.local"*/});
                        }
                      }
                      resolve();
                    }
                  }
                });
    }));
  }
}
