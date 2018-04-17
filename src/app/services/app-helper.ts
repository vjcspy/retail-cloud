import {Injectable} from '@angular/core';
import * as _ from "lodash";
import {AppStorage} from "./storage";
import {NotifyManager} from "./notify-manager";

@Injectable()
export class AppHelper {

  public isCheckedVersion = false;
  public baseUrl          = '';

  constructor(private storage: AppStorage,
              private notify: NotifyManager) {
  }

  checkApiVersionCompatible(apiVersion) {
    if (this.baseUrl !== this.storage.localRetrieve('baseUrl')) {
      this.isCheckedVersion = false;
      this.baseUrl          = this.storage.localRetrieve('baseUrl');
      if (!this.isCheckedVersion) {
        this.isCheckedVersion = true;
        const posProduct      = this.storage.localRetrieve('posProduct');
        if (posProduct) {
          let checkVersion = _.find(posProduct['versions'], v => v['version'] === this.getPosVersion());
          if (checkVersion) {
            const apiCompatible   = checkVersion['api_compatible'];
            const checkApiVersion = _.find(apiCompatible, av => av['version'] === apiVersion);
            if (!checkApiVersion) {
              this.notify.warning("connectpos_version_not_compat_api_version");
            }
          } else {
            this.notify.warning("connectpos_version_not_compat_api_version");
          }
        }
      }

    }
  }

  getPosVersion() {
    return "0.0.2";
  }

}
