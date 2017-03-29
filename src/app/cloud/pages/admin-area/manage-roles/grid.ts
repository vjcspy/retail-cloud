import {
  Component,
  OnInit,
  ViewChild, ElementRef
} from '@angular/core';
import {ManageProductsService} from "./manage-products.service";
import {ProductCollection} from "../../../services/ddp/collections/products";
import {AngularMeteorDataTableComponent} from "../../../../code/angular/components/angular-meteor-datatable";
import * as _ from "lodash";
import {Router} from "@angular/router";
import {ManageRolesService} from "./manage-roles.service";

@Component({
             selector   : 'manage-roles-grid',
             templateUrl: 'grid.html'
           })
export class ManageRolesGridComponent implements OnInit {
  @ViewChild('dataTable') dataTable: ElementRef;

  roles: any;

  constructor(protected manageRoleService: ManageRolesService,
              protected router: Router) {
    this.manageRoleService.viewState.headerText = "Grid";
  }

  ngOnInit(): void {
    let option = {
      ajax: {

      }
    };
  }
}
