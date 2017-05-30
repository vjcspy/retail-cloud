import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {ToastsManager} from "ng2-toastr";

@Injectable()
export class RequestService {
  
  constructor(protected http: Http,
              protected notify: ToastsManager) { }
  
  makeGet(url, option?: any) {
    return this.http.get(url, option)
               .map(
                 (res: Response) => {
                   return res.json();
                 })
               .catch(
                 (error: any) => {
                   let errMsg;
                   if (error['status'] === 0) {
                     // this.translate.get("check_internet").subscribe((res) => this.notify.error(res));
                   } else {
                     // In a real world app, we might use a remote logging infrastructure
                     // We'd also dig deeper into the error to get a better message
                     errMsg = (
                       error.message) ? error.message :
                       error.status ? `${error.status} - ${error.statusText}` : 'Server not responding';
                     this.notify.error(errMsg, "Opp!");
                   }
                   return Observable.throw(error);
                 });
  }
  
  makePost(url, data: any, showError: boolean = true) {
    return this.http
               .post(url, data)
               .map(
                 (res: Response) => {
                   return res.json();
                 })
               .catch(
                 (error: any) => {
                   if (showError) {
                     if (error['status'] === 0) {
                       // this.translate.get("check_internet").subscribe((res) => this.notify.error(res));
                     } else {
                       if (error.status === 400 && error.hasOwnProperty('_body')) {
                         let _mess = JSON.parse(error['_body']);
                         if (_mess.error === true) {
                           this.notify.warning(_mess['message'], null, {
                             newestOnTop: false,
                             showCloseButton: true,
                             enableHTML: true
                           });
                         } else {
                           // this.translate.get("unknown_error").subscribe((res) => this.notify.warning(res));
                         }
                       } else {
                         // this.translate.get("server_not_responding").subscribe((res) => this.notify.error(res));
                       }
                     }
                   }
                   return Observable.throw(error);
                 });
  }
  
  makeDelete(url) {
    return this.http
               .delete(url)
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
    return this.http
               .put(url, data)
               .map(
                 (res: Response) => {
                   return res.json();
                 })
               .catch(
                 (error: any) => {
                   if (error['status'] === 0) {
                     // this.translate.get("check_internet").subscribe((res) => this.notify.error(res));
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
  
  ping(url: string, multiplier = 1) {
    let request_image = (_url: string) => {
      return new Promise((resolve, reject) => {
        let img     = new Image();
        img.onload  = () => { resolve(img); };
        img.onerror = () => { reject(url); };
        img.src     = _url + '?random-no-cache=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);
      });
    };
    
    /**
     * Pings a url.
     * @param  {String} url
     * @param  {Number} multiplier - optional, factor to adjust the ping by.  0.3 works well for HTTP servers.
     * @return {Promise} promise that resolves to a ping (ms, float).
     */
    return new Promise((resolve, reject) => {
      let start    = (new Date()).getTime();
      let response = () => {
        let delta = ((new Date()).getTime() - start);
        delta *= (multiplier || 1);
        resolve(delta);
      };
      request_image(url).then(response).catch(response);
      
      // Set a timeout for max-pings, 5s.
      setTimeout(() => { reject(Error('Timeout')); }, 3000);
    });
  }
}
