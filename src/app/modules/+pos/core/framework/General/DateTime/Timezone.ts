import * as moment from "moment";
import {SettingDB} from "../../../../database/xretail/db/setting";
export class Timezone {
  isScopeDateInInterval(scope, dateFrom = null, dateTo = null): boolean {
    let _currentMoment = moment();
    
    let result = false;
    if (!!dateFrom && moment(dateFrom).isAfter(_currentMoment)) {
    
    }
    else if (!!dateTo) {
      let dateToAfterAddOneDay = moment(dateTo).add(86400, "s");
      if (dateToAfterAddOneDay.isAfter(_currentMoment))
        result = true;
    }
    else
      result = true;
    
    return result;
  }
  
  static getCurrentStringTime(useStoreTimezone: boolean = false): string {
    if (useStoreTimezone === true && SettingDB.getStoreConfigGroup("store")) {
      let timezone = Math.abs(SettingDB.getStoreConfigGroup("store")['time_zone']);
      if (SettingDB.getStoreConfigGroup("store")['time_zone'] < 0) {
        return moment().utc().add(timezone, "s").format("YYYY-MM-DD HH:mm:s");
      } else {
        return moment().utc().subtract(timezone, "s").format("YYYY-MM-DD HH:mm:s");
      }
    } else {
      return moment().format("YYYY-MM-DD HH:mm:s");
    }
  }
  
}
