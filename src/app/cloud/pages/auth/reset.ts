import {
  Component,
  OnInit
} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/ddp/auth.service";
import {ToastsManager} from "ng2-toastr";

@Component({
             selector   : 'reset-password',
             templateUrl: 'reset.html'
           })
export class ResetPasswordComponent implements OnInit {
  isLoading: boolean = false;
  token: string = "";
  private _data = {};
  constructor(protected router: Router,
              protected authService: AuthService,
              private activeRoute: ActivatedRoute,
              protected toast: ToastsManager) { }
  
  ngOnInit() {
    this.activeRoute.params.subscribe((p) => {
      this.token = p['token'];
      if (!!this.token){
        this._data = {
          new_password: "",
          confirm_new_password: ""
        };
      }else{
        this._data = {
          email: ""
        }
      }
    });
    if (this.authService.getCurrentUser())
      this.router.navigate(['']);
    else
      this.initPageJs();
  }
  
  private initPageJs() {
    let vm = this;
    let initValidationReminder = function () {
      jQuery('.js-validation-reminder').validate({
                                                   errorClass    : 'help-block text-right animated fadeInDown',
                                                   errorElement  : 'div',
                                                   errorPlacement: function (error, e) {
                                                     jQuery(e).parents('.form-group > div').append(error);
                                                   },
                                                   highlight     : function (e) {
                                                     jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                                                     jQuery(e).closest('.help-block').remove();
                                                   },
                                                   success       : function (e) {
                                                     jQuery(e).closest('.form-group').removeClass('has-error');
                                                     jQuery(e).closest('.help-block').remove();
                                                   },
                                                   rules         : {
                                                     'reminder-email': {
                                                       required: true,
                                                       email   : true
                                                     },
                                                     'new_password': {
                                                       required: true
                                                     },
                                                     'confirm_password': {
                                                       required: true
                                                     }
                                                   },
                                                   messages      : {
                                                     'reminder-email': {
                                                       required: 'Please enter a valid email address'
                                                     },
                                                     'new_password': {
                                                        required: 'Please enter new password'
                                                     },
                                                     'confirm_password': {
                                                       required: 'Please confirm new password'
                                                     },
                                                   },
                                                   submitHandler : function (form) {
                                                     vm.isLoading = true;
                                                     setTimeout(() => {
                                                       if (!!vm.token){
                                                         vm.authService.resetPassword(vm.token, vm._data)
                                                           .then(() => {
                                                             vm.router.navigate(['signin']);
                                                           }).catch((err) => {
                                                           vm.isLoading = false;
                                                           this.toast.error(err);
                                                         });
                                                       }else{
                                                         vm.authService.forgotPassword(vm._data)
                                                           .then(() => {
                                                             vm.router.navigate(['signin']);
                                                           }).catch((err) => {
                                                           vm.isLoading = false;
                                                           vm.toast.error(err);
                                                         });
                                                       }

                                                     }, 1000);

                                                    }
                                                 });
    };
    initValidationReminder();
  }
  
}
