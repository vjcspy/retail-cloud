import {
  Component,
  OnInit,
  ViewChild, ElementRef
} from '@angular/core';
import {ManageProductsService} from "./manage-products.service";
import * as _ from "lodash";
import {Router} from "@angular/router";
import {ManageRolesService} from "./manage-roles.service";
import {ManageUsersService} from "../manage-users/manage-users.service";
import {ToastsManager} from "ng2-toastr";

@Component({
             selector   : 'manage-roles-grid',
             templateUrl: 'grid.html'
           })
export class ManageRolesGridComponent implements OnInit {
  @ViewChild('dataTable') dataTable: ElementRef;

  roles: any;
  roleIdRemove: number;

  constructor(protected manageRoleService: ManageRolesService,
              protected userService: ManageUsersService,
              protected toast: ToastsManager,
              protected router: Router) {
    this.manageRoleService.viewState.headerText = "Grid";
  }

  ngOnInit(): void {
    this.initPage();
  }

  initPage(){
    let elementSelector = jQuery(this.dataTable.nativeElement);
    this.userService.getAllRoles().subscribe((data) => {
      this.roles = data;
      let option = {
        ajax: (request, drawCallback, settings) => {
          let json                = {};
          json['recordsTotal']    = this.roles.length;
          json['recordsFiltered'] = this.roles.length;
          json['draw']            = request.draw;

          json['data'] = _.slice(this.roles, request['start'], request['length'] + request['start']);
          drawCallback(json);
        },
        processing: true,
        serverSide: true,
        paging: true,
        scrollCollapse: true,
        responsive    : true,
        columns      : [
          {data: "id", title: "ID"},
          {data: "name", title: "Name"},
          {data: "is_active", title: "Active"},
          {data: "id", title: "Actions"}
        ],
        columnDefs: [
          {
            className: "text-center",
            orderable: false,
            "render" : function (data, type, row) {
              let _html = `<div class="btn-group">`;
              _html += `<button class="btn btn-xs btn-default meteor-table-bt-edit" data-id="${data}" type="button" title="Edit Client">
                                                  <i class="fa fa-pencil"></i>
                                                </button>`;
              _html += ` <button class="btn btn-xs btn-default meteor-table-bt-remove" data-id="${data}" type="button" title="Remove Client">
                                                  <i class="fa fa-times"></i>
                                                </button>`;
              _html += `</div>`;

              return _html;

            },
            "targets": [3]
          },
          {
            className: "text-center",
            orderable: false,
            "render" : function (data, type, row) {
              let _html;
              if (data){
                _html = "enabled";
              }else{
                _html = "disabled";
              }
              return _html;
            },
            "targets": [2]
          }
        ],
        bFilter:false
      };
      elementSelector.DataTable(option);
    });

    this.actionsRole(elementSelector);
  }

  actionsRole(elementSelector){
    let vm = this;
    setTimeout(() => {
      elementSelector.on('click', '.meteor-table-bt-edit', function () {
        vm.router.navigate(['/cloud/roles', jQuery(this).attr('data-id')]);
      });
    }, 100);
    setTimeout(() => {
      elementSelector.on('click', '.meteor-table-bt-remove', function () {
        jQuery('#meteor-dt-remove-modal').modal('show');
        vm.roleIdRemove = jQuery(this).attr('data-id');

      });
    }, 100);
  }

  removeRecord(){
    this.userService.removeRole(this.roleIdRemove)
      .subscribe(() => {
        this.toast.success("Role removed");
        this.router.navigate(['/cloud/roles']);
      });
  }
}

