import {
  Component,
  OnInit
} from '@angular/core';
import * as _ from "lodash";
import {ActivatedRoute, Router} from "@angular/router";
import {ManageRolesService} from "./manage-roles.service";
import {ManageUsersService} from "../manage-users/manage-users.service";
import {ToastsManager} from "ng2-toastr";

@Component({
             selector: 'role-form',
             templateUrl: 'form.html'
           })
export class RoleFormComponent implements OnInit {
  id: string = "";
  protected form_title: string;
  protected role = {
    name: "",
    is_active: ""
  };

  constructor(private route: ActivatedRoute,
              protected toast: ToastsManager,
              protected router: Router,
              protected roleService: ManageRolesService,
              protected userService: ManageUsersService){}

  ngOnInit(){
    this.route.params.subscribe((p) => {
      this.id = p['id'];
      if (this.id) {
        this.roleService.viewState.headerText = this.form_title = 'Edit Role';
      } else {
        this.roleService.viewState.headerText = this.form_title = 'Add Role';
      }
    });

    if (!!this.id){
      this.userService.getAllRoles().subscribe((data) => {
        this.role = _.find(data, (role) => {
          return role.id == this.id;
        });
      });
    }

    this.initPageJs();
  }

  private initPageJs() {
    let vm                            = this;
    let initFormMaterial = function () {
      jQuery('.js-validation-role-form').validate({
                                                       errorClass: 'help-block text-right animated fadeInDown',
                                                       errorElement: 'div',
                                                       errorPlacement: function (error, e) {
                                                         jQuery(e).parents('.form-group > div').append(error);
                                                       },
                                                       highlight: function (e) {
                                                         var elem = jQuery(e);

                                                         elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                                                         elem.closest('.help-block').remove();
                                                       },
                                                       success: function (e) {
                                                         var elem = jQuery(e);

                                                         elem.closest('.form-group').removeClass('has-error');
                                                         elem.closest('.help-block').remove();
                                                       },
                                                       rules: {
                                                         'val-role_name': {
                                                           required: true
                                                         },
                                                         'val-status': {
                                                           required: true
                                                         },
                                                       },
                                                       messages: {
                                                         'val-role_name': {
                                                           required: 'Please enter role name',
                                                         },
                                                         'val-status': {
                                                           required: 'Please select one role status',
                                                         },
                                                       },
                                                       submitHandler: function (form) {
                                                         vm.userService.postRole(vm.role).subscribe(() => {
                                                           if (!!vm.id){
                                                             vm.toast.success("Edit Role Successfully");
                                                           }else{
                                                             vm.toast.success("Create Role Successfully");
                                                           }
                                                            vm.router.navigate(['/cloud/roles']);
                                                         });
                                                       }
                                                     });
    };
    initFormMaterial();
  }
}
