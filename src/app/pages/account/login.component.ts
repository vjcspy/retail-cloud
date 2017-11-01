import {
  AfterViewInit,
  Component, OnDestroy,
  OnInit
} from '@angular/core';
import * as jQuery from "jquery";
import {RouterActions} from "../../R/router/router.actions";
import {LocalStorage} from "ngx-webstorage";
import {AccountActions} from "../../R/account/account.actions";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {AccountState} from "../../R/account/account.state";
import * as _ from 'lodash';

@Component({
             selector: 'sign-in',
             templateUrl: 'login.component.html',
             styleUrls: ['css/signin.scss']
           })
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @LocalStorage()
  public email;
  public password;
  public baseUrls = [ "mage2ee.local","xpos.ispx.smartosc.com"]
  public baseUrl;
  
  accountState$: Observable<AccountState>;
  
  constructor(protected accountActions: AccountActions, protected routerActions: RouterActions, protected store$: Store<any>) {
    this.accountState$ = this.store$.select('account');
  }
  
  ngOnInit() {
    this.initPageJs();
  }
  
  ngAfterViewInit(): void {
    if(!this.baseUrl){
      this.baseUrl = this.baseUrls[0];
    }
    if (!this.email || this.email === 'admin') {
      this.email    = 'admin';
      this.password = 'admin123';
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
      this.accountActions.login({
                                  username: window.btoa(this.email),
                                  password: window.btoa(this.password)
                                } , this.baseUrl);
    }
  }
  
  ngOnDestroy(): void {
    this.validate.destroy();
  }
  
  
  selectWebsite($event) {
    if (_.isString($event) && $event !== 'null' && this.baseUrl !== $event) {
      this.baseUrl = $event;
    }
    // else {
    //   this.notify.error("sorry_we_can_not_select_base_url");
    // }
  }
  
}
