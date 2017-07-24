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
    'check-open-shift': "check-open-shift",
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
    'product-cache': 'product-cache'
  };
  
  get(apiKey, baseUrl: string): string {
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
    if (baseUrl.indexOf("http") > -1) {
      return baseUrl + "/xrest/v1/uploader";
    } else {
      return this._isSecureHttp ?
        "https://" :
        "http://" + baseUrl + "/xrest/v1/uploader";
    }
  }
}
