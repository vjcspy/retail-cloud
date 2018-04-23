import {Injectable} from '@angular/core';
import {LicenseCollection} from "../meteor-collections/licenses";
import {AppStorage} from "../storage";
import * as _ from 'lodash';
import {AuthenticateService} from "../authenticate";

@Injectable()
export class TrackingService {
  static EVENT_SYNC_ORDER = 'EVENT_SYNC_ORDER';
  static EVENT_SAVE_ORDER = 'EVENEVENT_SAVE_ORDERT_COMPLETE_ORDER';

  protected _licenseKey;

  constructor(protected licenseCollection: LicenseCollection,
              protected storage: AppStorage,
              protected authService: AuthenticateService) {
  }

  tracking(event: String, data?: Object) {
    if (this.getLicenseKey()) {
      switch (event) {
        case TrackingService.EVENT_SYNC_ORDER:
          return this._syncOrderTracking(data);

        case TrackingService.EVENT_SAVE_ORDER:
          return this._saveOrderTracking(data);

        default:
      }
    }
  }

  loginTracking() {
    const user = this.authService.user ? this.authService.user : {};
    mixpanel.identify(this.getIdentifier()['id']);
    const data = {
      // "$email": this.getIdentifier()['email'],    // only special properties need the $

      // "$created": "2011-03-16 16:53:54",
      "$last_login": new Date(),         // properties can be dates...
      ...this.getIdentifier()
    };
    mixpanel.people.set(data);
  }

  private _syncOrderTracking(data?: Object) {
    setTimeout(() => {
      // mixpanel.identify(this.getIdentifier()['id']);
      mixpanel.track('Create Pay', {...this.getIdentifier()});
      ga('send', 'event', 'Create Pay', 'Account Create Pay', 'Account Create Pay Complete');
    });
  }

  private _saveOrderTracking(data?: Object) {
    let totals = {};
    if (data.hasOwnProperty('orderOffline') && data['orderOffline'].hasOwnProperty('totals')) {
      totals = data['orderOffline']['totals'];
    }
    setTimeout(() => {
      // mixpanel.identify(this.getIdentifier()['id']);
      mixpanel.track('Order', {...this.getIdentifier(), ...totals});
      ga('send', 'event', 'Order', 'Account Order', 'Account Order Complete');

    });
  }

  protected getIdentifier() {
    const user  = this.authService.user ? this.authService.user : {};
    const email = _.isArray(user['emails']) ? user['emails'][0]['address'] : null;
    return {licenseKey: this.getLicenseKey(), username: user['username'], email, id: user['_id']};
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
