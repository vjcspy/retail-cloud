import * as _ from "lodash";
import {GeneralException} from "../../../core/framework/General/Exception/GeneralException";
import {DataObject} from "../../../core/framework/General/DataObject";

export class SettingDB extends DataObject {
  static _SETTING: ConfigInterface[];
  
  key: string;
  value: any;
  store_id: number;
  
  static getFields(): string {
    return "key++,value";
  }
  
  static getCode(): string {
    return 'settings';
  }
  
  static getStoreConfig(group: string, key: string): ConfigInterface {
    if (typeof SettingDB._SETTING == "undefined")
      throw new GeneralException("setting must init before");
    
    let _config = _.find(SettingDB._SETTING, {key: group});
    return _config != undefined ? _config['value'][key] : null;
  }
  
  static getStoreConfigGroup(group: string) {
    if (typeof SettingDB._SETTING == "undefined")
      throw new GeneralException("setting must init before");
    let _configGroup = _.find(SettingDB._SETTING, {key: group});
    return _configGroup != undefined ? _configGroup['value'] : null;
  }
  
  static async retrieveAllSettings(force: boolean = false) {
    if (force || typeof  SettingDB._SETTING == "undefined")
      SettingDB._SETTING = await window['retailDB'].settings.toArray();
    return true;
  }
}

interface ConfigInterface {
  key: string;
  value: any;
  store_id: number;
}
