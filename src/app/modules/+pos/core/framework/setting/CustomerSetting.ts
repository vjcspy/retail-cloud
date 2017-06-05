export class CustomerSetting {
  static set config(value) {
    this._config = value;
  }
  
  private static _config;
}
