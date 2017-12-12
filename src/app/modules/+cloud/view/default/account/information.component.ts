import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthenticateService} from "../../../../../services/authenticate";
import {AccountActions} from "../../../../../R/account/account.actions";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {AccountState} from "../../../../../R/account/account.state";

@Component({
             // moduleId: module.id,
             selector: 'account-information',
             templateUrl: 'information.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountInformationComponent implements OnInit {
  public user;
  protected validationElem;
  public accountState$: Observable<AccountState>;
  
  constructor(protected auth: AuthenticateService,
              protected accountActions: AccountActions,
              protected store$: Store<any>) {
    this.accountState$ = this.store$.select('account');
  }
  
  ngOnInit() {
    const user = this.auth.user;
    if (!!user && user['_id']) {
      this.user = Object.assign({
                                  profile: {}
                                }, {...user});
      setTimeout(() => {
        this.initPageJs();
      });
    }
  }
  
  private initPageJs() {
    let vm = this;
    if (this.validationElem) {
      this.validationElem.destroy();
    }
    this.validationElem = jQuery('.js-validation-profile-form')['validate']({
                                                                              errorClass: 'help-block text-right animated fadeInDown',
                                                                              errorElement: 'div',
                                                                              errorPlacement: (error, e) => {
                                                                                jQuery(e).parents('.form-group > div').append(error);
                                                                              },
                                                                              highlight: e => {
                                                                                let elem = jQuery(e);
        
                                                                                elem.closest('.form-group')
                                                                                    .removeClass('has-error')
                                                                                    .addClass('has-error');
                                                                                elem.closest('.help-block').remove();
                                                                              },
                                                                              success: e => {
                                                                                let elem = jQuery(e);
        
                                                                                elem.closest('.form-group').removeClass('has-error');
                                                                                elem.closest('.help-block').remove();
                                                                              },
                                                                              rules: {
                                                                                'firstname': {
                                                                                  required: true,
                                                                                },
                                                                                'lastname': {
                                                                                  required: true,
                                                                                },
                                                                                'username': {
                                                                                  required: true
                                                                                },
                                                                                inputPassword: {
                                                                                  minlength: 8
                                                                                },
                                                                                'confirmPassword': {
                                                                                  equalTo: '#inputPassword'
                                                                                },
                                                                              },
                                                                              messages: {
                                                                                'firstname': {
                                                                                  required: 'First name is required',
                                                                                },
                                                                                'lastname': {
                                                                                  required: 'Last name is required',
                                                                                },
                                                                                'username': {
                                                                                  required: 'Please enter a username'
                                                                                },
                                                                                'confirmPassword': {
                                                                                  equalTo: 'Please enter the same password as above'
                                                                                },
                                                                              },
                                                                              submitHandler: form => {
                                                                                vm.accountActions.saveUserProfile(vm.user);
                                                                              }
                                                                            });
  }
}
