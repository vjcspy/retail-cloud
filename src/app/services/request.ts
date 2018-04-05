import {Injectable} from '@angular/core';
import {Headers, Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {NotifyManager} from "./notify-manager";
import {AppHelper} from "./app-helper";

@Injectable()
export class RequestService {
  protected header;
  
  constructor(protected http: Http,
              protected notify: NotifyManager,
              protected helper: AppHelper) {
  }
  
  getRequestOptions() {
    if (typeof this.header === 'undefined') {
      this.header = new Headers();
      // this.header.append("Black-Hole", "mr.vjcspy@gmail.com");
      this.header.append("Content-Type", "text/plain");
    }
    
    return {headers: this.header};
  }
  
  _prepareUrl(url: string): string {
    url += url.indexOf('?') > -1 ?
      `&forceFullPageCache=${Date.now()}&token_key=${btoa('mr.vjcspy@gmail.com')}` :
      `?forceFullPageCache=${Date.now()}&token_key=${btoa('mr.vjcspy@gmail.com')}`;
    
    return url;
  }
  
  makeGet(url, option?: any) {
    url = this._prepareUrl(url);
    
    return this.http.get(url, Object.assign({}, this.getRequestOptions(), option))
               .map(
                 (res: Response) => {
                   let dataResponse = res.json();
                   if(dataResponse['api_version']) {
                       this.helper.checkApiVersionCompatible(dataResponse['api_version']);
                   }
                   return dataResponse;
                 })
               .catch(
                 (error: any) => {
                   let errMsg;
                   if (error['status'] === 0) {
                     this.notify.error('Internal Server Error');
                   } else {
                     if (error.status === 400 && error.hasOwnProperty('_body')) {
                       let _mess = JSON.parse(error['_body']);
                       if (_mess.error === true) {
                         this.notify.error(_mess['message'], null, {
                           newestOnTop: false,
                           showCloseButton: true,
                           enableHTML: true
                         });
                       } else {
                         this.notify.error('unknown_error');
                       }
                     } else {
                       errMsg = (
                         error.message) ? error.message :
                         error.status ? `${error.status} - ${error.statusText}` : 'Server not responding';
                       this.notify.error(errMsg, "Opp!");
                     }
                   }
                   return Observable.throw(error);
                 });
  }
  
  makePost(url, data: any, showError: boolean = true) {
    url = this._prepareUrl(url);
    
    return this.http
               .post(url, data, this.getRequestOptions())
               .map(
                 (res: Response) => {
                   return res.json();
                 })
               .catch(
                 (error: any) => {
                   if (showError) {
                     if (error['status'] === 0) {
                       this.notify.error('Internal Server Error');
                     } else {
                       if (error.status === 400 && error.hasOwnProperty('_body')) {
                         let _mess = JSON.parse(error['_body']);
                         if (_mess.error === true) {
                           this.notify.error(_mess['message'], null, {
                             newestOnTop: false,
                             showCloseButton: true,
                             enableHTML: true
                           });
                         } else {
                           this.notify.error('unknown_error');
                         }
                       } else {
                         this.notify.error('server_not_responding');
                       }
                     }
                   }
                   return Observable.throw(error);
                 });
  }
  
  makeDelete(url) {
    url = this._prepareUrl(url);
    
    return this.http
               .delete(url, this.getRequestOptions())
               .map(
                 (res: Response) => {
                   return res.json();
                 })
               .catch(
                 (error: any) => {
                   return Observable.throw(error);
                 });
  }
  
  makePut(url, data: any) {
    url = this._prepareUrl(url);
    
    return this.http
               .put(url, data, this.getRequestOptions())
               .map(
                 (res: Response) => {
                   return res.json();
                 })
               .catch(
                 (error: any) => {
                   if (error['status'] === 0) {
                     this.notify.error('Internal Server Error');
                   } else {
                     // In a real world app, we might use a remote logging infrastructure
                     // We'd also dig deeper into the error to get a better message
                     let errMsg = (
                       error.message) ? error.message :
                       error.status ? `${error.status} - ${error.statusText}` : 'Server not responding';
                   }
                   return Observable.throw(error);
                 });
  }
  
  // ping(url, multiplier = 1) {
  //   let request_image = function (url) {
  //     return new Promise(function (resolve, reject) {
  //       var img     = new Image();
  //       img.onload  = function () { resolve(img); };
  //       img.onerror = function () { reject(url); };
  //       img.src     = url + '?random-no-cache=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);
  //     });
  //   };
  //
  //   /**
  //    * Pings a url.
  //    * @param  {String} url
  //    * @param  {Number} multiplier - optional, factor to adjust the ping by.  0.3 works well for HTTP servers.
  //    * @return {Promise} promise that resolves to a ping (ms, float).
  //    */
  //   return new Promise(function (resolve, reject) {
  //     var start    = (new Date()).getTime();
  //     var response = function () {
  //       var delta = ((new Date()).getTime() - start);
  //       delta *= (multiplier || 1);
  //       resolve(delta);
  //     };
  //     request_image(url).then(response).catch(response);
  //
  //     // Set a timeout for max-pings, 5s.
  //     setTimeout(function () { reject(Error('Timeout')); }, 3000);
  //   });
  // }
}
