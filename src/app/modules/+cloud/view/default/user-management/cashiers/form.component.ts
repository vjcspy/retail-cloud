import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticateService} from "../../../../../../services/authenticate";
import {RouterActions} from "../../../../../../R/router/router.actions";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {UserCollection} from "../../../../../../services/meteor-collections/users";
import {MongoObservable} from "meteor-rxjs";
import {NotifyManager} from "../../../../../../services/notify-manager";
import {AbstractSubscriptionComponent} from "../../../../../../code/AbstractSubscriptionComponent";

@Component({
             // moduleId: module.id,
             selector: 'cashier-form',
             templateUrl: 'form.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class CashierFormComponent extends AbstractSubscriptionComponent implements OnInit, OnDestroy {
  public user = {
    profile: {
      status: 1
    }
  };
  
  private _vaidation;
  
  constructor(public authService: AuthenticateService,
              public routerActions: RouterActions,
              public route: ActivatedRoute,
              protected userCollection: UserCollection,
              protected changeDetectorRef: ChangeDetectorRef,
              protected notify: NotifyManager) {
    super();
  }
  
  ngOnInit() {
    this.subscribeObservable('user', () =>
      Observable
        .combineLatest(
          this.route.params,
          this.userCollection.getCollectionObservable()
        ).subscribe((z: any) => {
        const params                                          = z[0];
        const userCollection: MongoObservable.Collection<any> = z[1];
        
        if (!!params['id']) {
          const user = userCollection.findOne({_id: params['id']});
          
          if (user) {
            this.user          = user;
            this.user['email'] = user['emails'][0]['address'];
            
            this.changeDetectorRef.detectChanges();
          } else {
            this.notify.error("sory_we_can_not_find_this_user_with_id: " + params['id']);
            this.back();
          }
        }
      })
    );
    
    this.initPageJs();
  }
  
  private initPageJs() {
    this._vaidation = jQuery('.js-validation-user')['validate']({
                                                                  ignore: [],
                                                                  errorClass: 'help-block text-right animated fadeInDown',
                                                                  errorElement: 'div',
                                                                  errorPlacement: (error, e) => {
                                                                    jQuery(e).parents('.form-group > div').append(error);
                                                                  },
                                                                  highlight: e => {
                                                                    const elem = jQuery(e);
        
                                                                    elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                                                                    elem.closest('.help-block').remove();
                                                                  },
                                                                  success: e => {
                                                                    const elem = jQuery(e);
        
                                                                    elem.closest('.form-group').removeClass('has-error');
                                                                    elem.closest('.help-block').remove();
                                                                  },
                                                                  rules: {
                                                                    'firstname': {
                                                                      required: true
                                                                    },
                                                                    'lastname': {
                                                                      required: true
                                                                    },
                                                                    'username': {
                                                                      required: true,
                                                                      minlength: 5
                                                                    },
                                                                    'email': {
                                                                      required: true,
                                                                      email: true
                                                                    },
                                                                    status: {
                                                                      required: true
                                                                    }
                                                                  },
                                                                  messages: {
                                                                    'username': {
                                                                      required: 'Please enter a username',
                                                                      minlength: 'Your username must consist of at least 5 characters'
                                                                    },
                                                                    'email': {
                                                                      required: 'Please enter an email address',
                                                                      EMAIL: 'Please enter a valid email address'
                                                                    },
                                                                    'lastname': {
                                                                      required: 'Please enter a last name',
                                                                    },
                                                                    'firstname': {
                                                                      required: 'Please enter a first name',
                                                                    },
                                                                    'phone': {
                                                                      PHONE: 'Phone is invalid'
                                                                    },
                                                                    'status': {
                                                                      required: 'Status is required'
                                                                    }
                                                                  },
                                                                  submitHandler: () => {
                                                                    if (!!this.user['_id']) {
                                                                    } else {
                                                                    }
                                                                  }
                                                                });
  }
  
  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this._vaidation) {
      this._vaidation.destroy();
    }
  }
  
  back() {
    this.routerActions.go('cloud/default/user-management/cashier/list');
  }
}
