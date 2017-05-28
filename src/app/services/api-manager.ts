import {Injectable} from '@angular/core';
import {GeneralException} from "../modules/+pos/core/framework/General/Exception/GeneralException";

@Injectable()
export class ApiManager {
  private _middleUrl: string = "xrest/v1/xretail";
  private _isSecureHttp;
  private _apiUrl            = {
    /*Retail*/
    retailConfig: 'retail-setting',
    outlet: 'outlet',
    register: 'register',
    
    /*Pos*/
    products: "product",
    category: "category",
    customers: "customer",
    stores: "store",
    taxes: "tax-rates",
    settings: "setting",
    countries: "country-region",
    taxClass: "tax-class",
    customerGroup: "customer-group",
    loadOrderData: "load-order-data",
    saveOrder: "save-order",
    customerAddress: "customer-address",
    creditmemo: "creditmemo",
    wishlist: "wishlist",
    orders: "order",
    userOrderCount: "user-order-count",
    shipment: "shipment",
    payment: "payment",
    shifts: "shifts",
    'check-shifts': "check-shifts",
    'open-shift': "open-shift",
    'close-shift': "close-shift",
    'adjust-shift': "adjust-shift",
    receipts: "receipts",
    "take-payment": "take-payment",
    "reward-point-apply": "reward-point-apply",
    "send-email": "send-email",
    "warehouse": "warehouse",
    "role": "role",
    "permission": "permission",
    customerDetail: "customer-detail",
    updateCustomerWishlist: "update-wishlist",
  };
  
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
    } else {
      throw new GeneralException("API not yet config");
    }
  }
  
  getUploaderUrl() {
    if (this.getBaseUrl().indexOf("http") > -1) {
      return this.getBaseUrl() + "/xrest/v1/uploader";
    } else {
      return this._isSecureHttp ?
        "https://" :
        "http://" + this.getBaseUrl() + "/xrest/v1/uploader";
    }
  }
  
  getBaseUrl(url: string = "") {
    return "http://mage2.dev";
  }
}
