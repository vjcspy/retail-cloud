import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {ToastsManager} from "ng2-toastr";
import {Observable} from "rxjs";

@Injectable()
export class RequestService {

    constructor(protected http:Http, protected notify:ToastsManager) {}

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
                               if (error.status == 400 && error.hasOwnProperty('_body')) {
                                   let _mess = JSON.parse(error['_body']);
                                   if (_mess.error == true) {
                                       this.notify.warning(_mess['message']);
                                   } else {
                                       this.notify.warning("Unknown error from server");
                                   }
                               } else {
                                   this.notify.error("Server Error.");
                               }
                           }
                           return Observable.throw(error);
                       });
    }


}