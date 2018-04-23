import {Injectable} from '@angular/core';
import * as _ from "lodash";
import {AppStorage} from "./storage";
import {NotifyManager} from "./notify-manager";
import * as Cookies from "js-cookie";

@Injectable()
export class AppHelper {
    
    constructor(private storage: AppStorage,
                private notify: NotifyManager) {}
    
    checkApiVersionCompatible() {
            const posProduct = this.storage.localRetrieve('posProduct');
            if(posProduct) {
                let checkVersion = _.find(posProduct['versions'], v => v['version'] === this.getPosVersion());
                let checkVersionCookie = _.find(posProduct['versions'], v => v['version'] === Cookies.get('pos_version'));
                if(this.checkApiCompatible(checkVersion) || this.checkApiCompatible(checkVersionCookie)) {
                    return true;
                } else {
                    return false;
                }
            }
    }
    checkApiCompatible(checkVersion = null) {
        if (!_.isNull(checkVersion)) {
            const apiCompatible   = checkVersion['api_compatible'];
            const checkApiVersion = _.find(apiCompatible, av => av['version'] === Cookies.get('api_version'));
            return !!checkApiVersion ? true : false;
        } else {
            return false;
        }
    }
    
    getPosVersion() {
        return "0.0.2";
    }
    
}
