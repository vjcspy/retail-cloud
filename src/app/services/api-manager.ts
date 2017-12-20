import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {GeneralException} from "../code/GeneralException";

@Injectable()
export class ApiManager {
  private _middleUrl: string = "xrest/v1/xretail";
  private _isSecureHttp;
  private _apiUrl            = {
    login : 'login-report',
    dashboard: "dashboard",
    salesreport: 'salesreport'
  };
  
  get(apiKey, baseUrl?: string): string {
    if (!_.isString(baseUrl)) {
      throw new GeneralException("can_get_base_url");
    }
    
    if (this._apiUrl.hasOwnProperty(apiKey)) {
      if (baseUrl.indexOf("http") === -1) {
        baseUrl = this._isSecureHttp ?
          "https://" :
          "http://" +
          baseUrl;
      }
      return baseUrl +
             "/" +
             this._middleUrl +
             "/" +
             this._apiUrl[apiKey];
    } else {
      throw new GeneralException("API not yet config");
    }
  }
  
  getUploaderUrl(baseUrl: string) {
    if (!_.isString(baseUrl)) {
      throw new GeneralException("can_get_base_url");
    }
    
    if (baseUrl.indexOf("http") > -1) {
      return baseUrl + "/xrest/v1/uploader";
    } else {
      return this._isSecureHttp ?
        "https://" :
        "http://" + baseUrl + "/xrest/v1/uploader";
    }
  }
}
