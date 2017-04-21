import {Injectable} from '@angular/core';
import {RetailDataManagement} from "./retail-data-management";
import {GeneralException} from "../../core/framework/General/Exception/GeneralException";

@Injectable()
export class APIManager {
  private _middleUrl: string = "xrest/v1/xretail";
  private _isSecureHttp;
  private _apiUrl            = {
    "dashboard": "dashboard-chart"
  };
  private _baseUrls;
  
  setBaseUrls(baseUrls: string[]): APIManager {
    this._baseUrls = baseUrls;
    
    return this;
  }
  
  getBaseUrl(url?: string) {
    if (!!url)
      return url;
    
    return this._baseUrls[0];
  }
  
  constructor() { }
  
  get(apiKey, url?: string): string {
    if (this._apiUrl.hasOwnProperty(apiKey)) {
      let baseUrl = "";
      if (this.getBaseUrl().indexOf("http") > -1) {
        baseUrl = this.getBaseUrl(!!url ? url : null);
      } else {
        baseUrl = this._isSecureHttp ?
          "https://" :
          "http://" +
          this.getBaseUrl(!!url ? url : null);
      }
      return baseUrl +
             "/" +
             this._middleUrl +
             "/" +
             this._apiUrl[apiKey];
    }
    else
      throw new GeneralException("API not yet config");
  }
  
  getUploaderUrl() {
    if (this.getBaseUrl().indexOf("http") > -1) {
      return this.getBaseUrl() + "/xrest/v1/uploader";
    } else
      return this._isSecureHttp ?
        "https://" :
        "http://" + this.getBaseUrl() + "/xrest/v1/uploader";
  }
}
