import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import {AuthService} from "../../services/ddp/auth.service";
import {RouterActions} from "../../R/router/router.actions";
import {AccountActions} from "../../R/account/account.actions";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {AccountState} from "../../R/account/account.state";
import {NotifyManager} from "../../services/notify-manager";

@Component({
             selector: 'sign-up',
             templateUrl: 'register.component.html',
             styleUrls: ['css/signin.scss'],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class RegisterComponent implements OnInit {
  protected user = {username: "vjcspy1", email: "khoild@smartosc.com", password: "admin123", acceptTerm: false};
  private accountState$: Observable<AccountState>;
  
  constructor(protected routerActions: RouterActions, protected accountAction: AccountActions, protected store$: Store<any>, protected notify: NotifyManager) {
    this.accountState$ = this.store$.select('account');
  }
  
  ngOnInit() {
    this.initPageJs();
  }
  
  private initPageJs() {
    let vm                     = this;
    let initValidationRegister = () => {
      jQuery('.js-validation-register')['validate']({
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
                                                        'register-username': {
                                                          required: true,
                                                          minlength: 6
                                                        },
                                                        'register-email': {
                                                          required: true,
                                                          email: true
                                                        },
                                                        'register-password': {
                                                          required: true,
                                                          minlength: 8
                                                        },
                                                        'register-password2': {
                                                          required: true,
                                                          equalTo: '#register-password'
                                                        },
                                                        'register-terms': {
                                                          required: true
                                                        }
                                                      },
                                                      messages: {
                                                        'register-username': {
                                                          required: 'Please enter a username',
                                                          minlength: 'Your username must consist of at least 6 characters'
                                                        },
                                                        'register-email': {
                                                          required: 'Please enter an email address',
                                                          EMAIL: 'Please enter a valid email address'
                                                        },
                                                        'register-password': {
                                                          required: 'Please provide a password',
                                                          minlength: 'Your password must be at least 8 characters long'
                                                        },
                                                        'register-password2': {
                                                          required: 'Please provide a password',
                                                          minlength: 'Your password must be at least 8 characters long',
                                                          equalTo: 'Please enter the same password as above'
                                                        },
                                                        'register-terms': 'You must agree to the service terms!'
                                                      },
                                                      submitHandler: () => {
                                                        if (vm.user.acceptTerm) {
                                                          vm.accountAction.register(vm.user);
                                                        } else {
                                                          this.notify.warning("must_agree_with_term");
                                                        }
                                                      }
                                                    });
    };
    initValidationRegister();
  }
}
