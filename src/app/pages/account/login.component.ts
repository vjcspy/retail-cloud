import {
  AfterViewInit,
  Component, OnDestroy,
  OnInit
} from '@angular/core';
import * as jQuery from "jquery";
import {AuthenticateService} from "../../services/authenticate";
import {RouterActions} from "../../R/router/router.actions";
import {LocalStorage} from "ngx-webstorage";

@Component({
             selector: 'sign-in',
             templateUrl: 'login.component.html',
             styleUrls: ['css/signin.scss']
           })
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @LocalStorage()
  public email;
  public password;
  public isLoading: boolean = false;
  
  constructor(protected authService: AuthenticateService, protected routerActions: RouterActions) { }
  
  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.routerActions.go('');
    }
    else {
      this.initPageJs();
    }
  }
  
  ngAfterViewInit(): void {
    if (!this.email) {
      this.email    = 'cashier@smartosc.com';
      this.password = 'cashier123';
    }
  }
  
  protected validate;
  protected jForm;
  
  private initPageJs() {
    this.jForm    = jQuery('.js-validation-login');
    this.validate = this.jForm['validate']({
                                             errorClass: 'help-block text-right animated fadeInDown',
                                             errorElement: 'div',
                                             errorPlacement: function (error, e) {
                                               jQuery(e).parents('.form-group > div').append(error);
                                             },
                                             highlight: function (e) {
                                               jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                                               jQuery(e).closest('.help-block').remove();
                                             },
                                             success: function (e) {
                                               jQuery(e).closest('.form-group').removeClass('has-error');
                                               jQuery(e).closest('.help-block').remove();
                                             },
                                             rules: {
                                               'login-username': {
                                                 required: true,
                                                 //minlength: 6
                                               },
                                               'login-password': {
                                                 required: true,
                                                 minlength: 8
                                               }
                                             },
                                             messages: {
                                               'login-username': {
                                                 required: 'Please enter a username',
                                                 minlength: 'Your username must consist of at least 6 characters'
                                               },
                                               'login-password': {
                                                 required: 'Please provide a password',
                                                 minlength: 'Your password must be at least 8 characters long'
                                               }
                                             }
                                           });
    
  }
  
  login() {
    if (this.jForm.valid()) {
      this.isLoading = true;
      setTimeout(() => {
        this.authService
            .signIn({
                      username: this.email,
                      password: this.password
                    })
            .then(() => {
              if (this.authService.redirectUrl) {
                this.routerActions.go(this.authService.redirectUrl);
              } else {
                this.routerActions.go('pos/default/sales/checkout');
              }
            }, err => {
            });
        this.isLoading = false;
      }, 1000);
    }
  }
  
  ngOnDestroy(): void {
    this.validate.destroy();
  }
}
