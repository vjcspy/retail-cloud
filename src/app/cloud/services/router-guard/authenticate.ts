import {Injectable} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router, Resolve
} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../ddp/auth.service";
import {LicenseCollection} from "../ddp/collections/licenses";
import {APIManager} from "../api-manager";
import * as $q from 'q';
import {ToastsManager} from "ng2-toastr";
import {ProductCollection} from "../ddp/collections/products";

@Injectable()
export class AuthenticateGuard implements CanActivate, Resolve<any> {
  
  protected _data = {};
  
  constructor(protected authService: AuthService,
              protected licenseCollection: LicenseCollection,
              protected productCollection: ProductCollection,
              protected apiManager: APIManager,
              protected router: Router,
              protected notify: ToastsManager) { }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      if (currentUser.hasOwnProperty('profile') && currentUser.profile.hasOwnProperty('is_disabled') && currentUser.profile.is_disabled) {
        Meteor.logout();
        this.router.navigate(['']);
      }
      // if(!currentUser.emails[0].verified){
      //   alert('Please verify your email');
      //   this.router.navigate(['/verify_email']);
      //   return false;
      // }
      return true;
    } else {
      this.authService.redirectUrl = state.url;
      this.router.navigate(['/signin']);
      return false;
    }
  }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    let defer                                  = $q.defer();
    this._data['subscribeLicenseToGetBaseUrl'] =
      Observable.combineLatest(this.productCollection.getCollectionObservable(), this.licenseCollection.getCollectionObservable())
                .subscribe(([productCollection, licenseCollection]) => {
                  const products  = productCollection.find().fetch();
                  const reportPro = _.find(products, p => p['code'] == 'report');
                  if (reportPro) {
                    const licenses = licenseCollection.find().fetch();
                    if (_.size(licenses) == 1) {
                      const license       = licenses[0];
                      const reportProduct = _.find(license['has_product'], p => p['product_id'] == reportPro['_id']);
                      if (reportProduct) {
                        console.log(reportProduct);
                        if (_.isArray(reportProduct['base_url']) && _.size(reportProduct['base_url']) > 0) {
                          this.apiManager.setBaseUrls(reportProduct['base_url']);
                
                          if (this._data.hasOwnProperty('subscribeLicenseToGetBaseUrl')) {
                            this._data['subscribeLicenseToGetBaseUrl'].unsubscribe();
                          }
                          return defer.resolve(reportProduct['base_url']);
                        }
                      }
                    }
                  }
                  this.notify.error("Can't get base url");
                  return defer.reject("Can't get base url");
                });
    return <any>defer.promise;
  }
}
