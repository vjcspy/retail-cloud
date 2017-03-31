import {Injectable} from '@angular/core';
import {ToastsManager} from "ng2-toastr";
import {MeteorObservable} from "meteor-rxjs";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {Response, Http, URLSearchParams, RequestOptions, Headers} from "@angular/http";

@Injectable()
export class ManageUsersService {
  viewState: any = {
    headerText: ""
  };
  viewData: any  = {};

  constructor(protected toast: ToastsManager,
              protected router: Router,
              private http: Http) { }

  createUser(data): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call("user.create_user", data).subscribe(res => {
        resolve();
      }, (err) => {
        console.log(err);
        this.toast.error(err.reason, err.error);
      });
    });
  }

  editUser(data): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call("user.edit_user", data).subscribe(res => {
        resolve();
      }, (err) => {
        this.toast.error(err.reason, err.error);
      });
    });
  }
  removeUser(data: any){
    return new Promise<void>((resolve, reject) => {
      MeteorObservable.call("user.remove_user", data).subscribe((res) => {
        this.toast.success("Remove User Successfully");
        resolve();
      }, (err) => {
        this.toast.error(err.reason, err.error);
        return reject(err);
      });
    });
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }

  getAllRoles(): Observable<any>{
    return this.http.get("http://mage2.xds.smartosc.com/xrest/v1/xretail/role")
               .map((data) => {
                 return JSON.parse(data._body).items;
               }).catch(this.handleError);
  }

  postRole(data): Observable<any>{
    return this.http.post("http://mage2.xds.smartosc.com/xrest/v1/xretail/role", data)
               .catch(this.handleError);
  }

  removeRole(data): Observable<any>{
    let params: URLSearchParams = new URLSearchParams();
    let options = new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});
    params.set('id', data);
    options.search = params;
    return this.http.delete("http://mage2.xds.smartosc.com/xrest/v1/xretail/role", options)
               .catch(this.handleError);
  }

}
