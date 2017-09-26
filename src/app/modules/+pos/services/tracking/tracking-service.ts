import {Injectable} from '@angular/core';
import {LicenseCollection} from "../../../../services/meteor-collections/licenses";
import {AppStorage} from "../../../../services/storage";
import * as _ from 'lodash';

@Injectable()
export class TrackingService {
  static EVENT_SYNC_ORDER = 'EVENT_SYNC_ORDER';
  static EVENT_SAVE_ORDER = 'EVENEVENT_SAVE_ORDERT_COMPLETE_ORDER';
  
  protected _licenseKey;
  
  constructor(protected licenseCollection: LicenseCollection, protected storage: AppStorage) {
  }
  
  tracking(event: String, data?: Object) {
    if (this.getLicenseKey()) {
      switch (event) {
        case TrackingService.EVENT_SYNC_ORDER:
          return this._syncOrderTracking();
        
        case TrackingService.EVENT_SAVE_ORDER:
          return this._saveOrderTracking();
        
        default:
      }
    }
  }
  
  private _syncOrderTracking() {
    setTimeout(() => {
      mixpanel.identify(this.getLicenseKey());
      mixpanel.track('Create Pay');
      ga('send', 'event', 'Create Pay', 'Account Create Pay', 'Account Create Pay Complete');
    });
  }
  
  private _saveOrderTracking() {
    setTimeout(() => {
      mixpanel.identify(this.getLicenseKey());
      mixpanel.track('Order');
      ga('send', 'event', 'Order', 'Account Order', 'Account Order Complete');
      
    });
  }
  
  protected getLicenseKey() {
    if (typeof this._licenseKey === 'undefined') {
      const license = this.storage.localRetrieve('license');
      if (license) {
        this._licenseKey = license['key'];
      } else {
        const licenses = this.licenseCollection.getCollection().find({}).fetch();
        if (_.size(licenses) === 1) {
          this._licenseKey = _.first(licenses)['key'];
        }
      }
    }
    
    return this._licenseKey;
  }
}
