import {GeneralException} from "../General/Exception/GeneralException";
export class CustomerSetting {
  static set config(value) {
    this._config = value;
  }
  
  private static _config;
  
  getDefaultCustomer() {
    return this.loadConfig('default_customer');
  }
  
  private loadConfig(key: string) {
    if (CustomerSetting._config.hasOwnProperty(key)) {
      return CustomerSetting._config[key]
    }
    throw new GeneralException("Can't get customer setting");
  }
}
