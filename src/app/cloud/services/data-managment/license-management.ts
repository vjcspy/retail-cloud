import {Injectable} from '@angular/core';
import {LicenseCollection} from "../ddp/collections/licenses";
import _ from 'lodash';

@Injectable()
export class LicenseManagement {
  
  constructor(protected licenseCollection: LicenseCollection) {
  
  }
  
  checkReportLicense() {
    this.licenseCollection
        .getCollectionObservable()
        .subscribe((collection) => {
          const licenses = collection.find().fetch();
          if (_.size(licenses) == 1) {
            const license       = licenses[0];
            const reportProduct = _.find(license['has_product'], p => p['product_id'] == 'report');
            if (reportProduct) {
            }
          }
        });
  }
}
