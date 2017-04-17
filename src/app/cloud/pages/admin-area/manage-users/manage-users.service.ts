import {Injectable} from '@angular/core';
import {ToastsManager} from "ng2-toastr";
import {MeteorObservable} from "meteor-rxjs";
import {Router} from "@angular/router";
import {Http, URLSearchParams, Headers, RequestOptions} from "@angular/http";
import {RequestService} from "../../../../service/request";

@Injectable()
export class ManageUsersService {
  viewState: any = {
    headerText: ""
  };
  protected isLoading: boolean = false;
  viewData: any  = {};

  constructor(protected toast: ToastsManager,
              protected router: Router,
              private http: Http,
              private requestService: RequestService) { }

  createUser(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      MeteorObservable.call("user.create_user", data).subscribe(res => {
        this.isLoading = false;
        resolve();
      }, (err) => {
        this.isLoading = false;
        console.log(err);
        this.toast.error(err.reason, err.error);
      });
    });
  }

  editUser(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      MeteorObservable.call("user.edit_user", data).subscribe(res => {
        this.isLoading = false;
        resolve();
      }, (err) => {
        this.isLoading = false;
        this.toast.error(err.reason, err.error);
      });
    });
  }
  removeUser(data: any){
    return new Promise<void>((resolve, reject) => {
      this.isLoading = true;
      MeteorObservable.call("user.remove_user", data).subscribe((res) => {
        this.isLoading = false;
        this.toast.success("Remove User Successfully");
        resolve();
      }, (err) => {
        this.isLoading = false;
        this.toast.error(err.reason, err.error);
        return reject(err);
      });
    });
  }

  updatePermission(data: any){
    return new Promise<void>((resolve, reject) => {
      this.isLoading = true;
      MeteorObservable.call("license.save_permission_to_role", data).subscribe((res) => {
        this.isLoading = false;
        this.toast.success("Update Permission Successfully");
        resolve();
      }, (err) => {
        this.isLoading = false;
        this.toast.error(err.reason, err.error);
        return reject(err);
      });
    });
  }

}
