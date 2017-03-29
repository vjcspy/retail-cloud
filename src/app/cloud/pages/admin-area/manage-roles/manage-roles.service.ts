import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import {ToastsManager} from "ng2-toastr";
import {Router} from "@angular/router";

@Injectable()
export class ManageRolesService {
  viewState: any = {
    headerText: ""
  };
  viewData: any  = {};

  constructor(protected toast: ToastsManager,
              protected router: Router) { }


}
