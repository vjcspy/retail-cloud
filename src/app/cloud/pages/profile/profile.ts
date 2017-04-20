import {
  Component,
  OnInit
} from '@angular/core';
import {AuthService} from "../../services/ddp/auth.service";
import {ToastsManager} from "ng2-toastr";

@Component({
             selector: 'user-profile',
             templateUrl: 'profile.html'
           })
export class UserProfileComponent implements OnInit {
  isLoading: boolean = false;

  private profile = {
    first_name: "",
    last_name: ""
  };
  private resetPassword = {
    old_password: "",
    new_password: "",
    confirm_new_password: ""
  };
  private _data = {};

  constructor(protected authService:AuthService,
              protected toast: ToastsManager) { }
  
  ngOnInit() {

    if (this.authService.getCurrentUser()){
      this._data = this.authService.getCurrentUser();
      if (!this._data.hasOwnProperty('profile')){
        this._data['profile'] = this.profile;
      }
    }
    this.initPageJs();
  }

  private initPageJs() {
    let vm                            = this;
    let initProfileValidationMaterial = function () {
      jQuery('.js-validation-profile-form').validate({
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
                                                         'profile-password': {
                                                           required: true
                                                         },
                                                         'profile-password-new': {
                                                           required: true
                                                         },
                                                         'profile-password-new-confirm': {
                                                           required: true
                                                         }
                                                       },
                                                       messages: {
                                                         'profile-password': {
                                                           required: 'Please enter current password'
                                                         },
                                                         'profile-password-new': {
                                                           required: 'Please enter new password'
                                                         },
                                                         'profile-password-new-confirm': {
                                                           required: 'Please confirm new password'
                                                         }
                                                       },
                                                       submitHandler: function (form) {
                                                         vm.isLoading = true;
                                                         setTimeout(() => {
                                                           if (vm.resetPassword['old_password'] && vm.resetPassword['new_password'] && vm.resetPassword['confirm_new_password']){
                                                             vm.authService.changePassword(vm.resetPassword)
                                                               .then(() => {
                                                                 vm.resetPassword = {
                                                                   old_password: "",
                                                                   new_password: "",
                                                                   confirm_new_password: ""
                                                                 };
                                                                 vm.toast.success('Password changed');
                                                               }).catch((err) => {
                                                               vm.toast.error(err);
                                                               return;
                                                             });
                                                           }else{
                                                             vm.authService.updateProfile(vm._data);
                                                             vm.toast.success("Profile Updated");
                                                           }
                                                           vm.isLoading = false;
                                                         },1000);

                                                        }
                                                     });
    };
    initProfileValidationMaterial();
  }
}
