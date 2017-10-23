import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NotifyManager} from "../../services/notify-manager";
import {AuthenticateService} from "../../services/authenticate";
import {RouterActions} from "../../R/router/router.actions";
import {AccountActions} from "../../R/account/account.actions";
import {Observable} from "rxjs/Observable";
import {AccountState} from "../../R/account/account.state";
import {Store} from "@ngrx/store";

@Component({
             // moduleId: module.id,
             selector: 'reset-component',
             templateUrl: 'reset.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ResetComponent implements OnInit, OnDestroy {
  token: string = "";
  data          = {};
  private validate: any;
  accountState$: Observable<AccountState>;
  
  constructor(protected router: Router,
              protected routerActions: RouterActions,
              protected authService: AuthenticateService,
              private activeRoute: ActivatedRoute,
              private accountActions: AccountActions,
              protected notify: NotifyManager,
              protected store$: Store<any>) {
    this.accountState$ = this.store$.select('account');
  }
  
  ngOnInit() {
    this.activeRoute.params.subscribe((p) => {
      this.token = p['token'];
      if (!!this.token) {
        this.data = {
          new_password: "",
          confirm_new_password: ""
        };
      } else {
        this.data = {
          email: ""
        };
      }
    });
    
    if (this.authService.user) {
      this.routerActions.go('');
    } else {
      this.initPageJs();
    }
  }
  
  private initPageJs() {
    let vm        = this;
    this.validate =
      jQuery('.js-validation-reminder')['validate']({
                                                      errorClass: 'help-block text-right animated fadeInDown',
                                                      errorElement: 'div',
                                                      errorPlacement: (error, e) => {
                                                        jQuery(e).parents('.form-group > div').append(error);
                                                      },
                                                      highlight: e => {
                                                        jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                                                        jQuery(e).closest('.help-block').remove();
                                                      },
                                                      success: e => {
                                                        jQuery(e).closest('.form-group').removeClass('has-error');
                                                        jQuery(e).closest('.help-block').remove();
                                                      },
                                                      rules: {
                                                        'reminder-email': {
                                                          required: true,
                                                          email: true
                                                        },
                                                        'new_password': {
                                                          required: true,
                                                          minlength: 8
                                                        },
                                                        'confirm_new_password': {
                                                          required: true,
                                                          equalTo: '#new_password'
                                                        }
                                                      },
                                                      messages: {
                                                        'reminder-email': {
                                                          required: 'Please enter a valid email address',
                                                        },
                                                        'new_password': {
                                                          required: 'Please enter new password'
                                                        },
                                                        'confirm_new_password': {
                                                          required: 'Please confirm new password',
                                                          equalTo: 'Please enter the same password as above'
                                                        },
                                                      },
                                                      submitHandler: () => {
                                                        if (vm.token) {
                                                          this.accountActions.resetPasswrod(vm.token, vm.data['new_password']);
                                                        } else {
                                                          this.accountActions.sendResetPassword({
                                                                                                  email: vm.data['email']
                                                                                                });
                                                        }
                                                      }
                                                    });
  }
  
  ngOnDestroy(): void {
    if (this.validate) {
      this.validate.destroy();
    }
  }
}
