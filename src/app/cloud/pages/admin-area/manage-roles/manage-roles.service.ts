import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import {ToastsManager} from "ng2-toastr";
import {Router} from "@angular/router";

@Injectable()
export class ManageRolesService {
  viewState: any = {
    headerText: ""
  };
  protected isLoading: boolean = false;
  viewData: any  = {};

  constructor(protected toast: ToastsManager,
              protected router: Router) { }

  addRole(data: any){
    return new Promise<void>((resolve, reject) => {
      this.isLoading = true;
      MeteorObservable.call("license.create_role", data).subscribe((res) => {
        this.isLoading = false;
        this.router.navigate(['cloud/roles']);
        this.toast.success("Create Role Successful");
        resolve();
      }, (err) => {
        this.isLoading = false;
        this.toast.error(err.reason, err.error);
        return reject(err);
      });
    });
  }

  editRole(data: any){
    return new Promise<void>((resolve, reject) => {
      this.isLoading = true;
      MeteorObservable.call("license.edit_role", data).subscribe((res) => {
        this.isLoading = false;
        this.router.navigate(['cloud/roles']);
        this.toast.success("Edit Role Successful");
        resolve();
      }, (err) => {
        this.isLoading = false;
        this.toast.error(err.reason, err.error);
        return reject(err);
      });
    });
  }

  removeRole(data: any){
    return new Promise<void>((resolve, reject) => {
      this.isLoading = true;
      MeteorObservable.call("license.remove_role", data).subscribe((res) => {
        this.isLoading = false;
        this.router.navigate(['cloud/roles']);
        this.toast.success("Remove Role Successful");
        resolve();
      }, (err) => {
        this.isLoading = false;
        this.toast.error(err.reason, err.error);
        return reject(err);
      });
    });
  }
}
