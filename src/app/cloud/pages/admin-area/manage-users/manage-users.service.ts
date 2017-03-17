import {Injectable} from '@angular/core';
import {ToastsManager} from "ng2-toastr";
import {MeteorObservable} from "meteor-rxjs";
import {Router} from "@angular/router";

@Injectable()
export class ManageUsersService {
  viewState: any = {
    headerText: ""
  };
  viewData: any  = {};

  constructor(protected toast: ToastsManager,
              protected router: Router) { }

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
        console.log(err);
        this.toast.error(err.reason, err.error);
      });
    });
  }

}
