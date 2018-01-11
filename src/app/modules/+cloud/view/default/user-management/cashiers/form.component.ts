import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticateService} from "../../../../../../services/authenticate";
import {RouterActions} from "../../../../../../R/router/router.actions";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {UserCollection} from "../../../../../../services/meteor-collections/users";
import {MongoObservable} from "meteor-rxjs";
import {NotifyManager} from "../../../../../../services/notify-manager";
import {AbstractSubscriptionComponent} from "../../../../../../code/AbstractSubscriptionComponent";
import {LicenseCollection} from "../../../../../../services/meteor-collections/licenses";
import * as _ from 'lodash';
import {ProductCollection} from "../../../../../../services/meteor-collections/products";
import {ShopManageActions} from "../../../../R/shop/actions";
import {ShopManageState} from "../../../../R/shop/state";
import {Store} from "@ngrx/store";

@Component({
             // moduleId: module.id,
             selector: 'cashier-form',
             templateUrl: 'form.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class CashierFormComponent extends AbstractSubscriptionComponent implements OnInit, OnDestroy {
  public user     = {
    profile: {
      first_name: "",
      last_name: ""
    },
    status: 1
  };
  public roles: any[];
  public license;
  public products = [];
  
  private _vaidation;
  
  public shopManage$: Observable<ShopManageState>;
  
  constructor(protected shopManage: ShopManageActions,
              public routerActions: RouterActions,
              public route: ActivatedRoute,
              protected userCollection: UserCollection,
              protected licenseCollection: LicenseCollection,
              protected changeDetectorRef: ChangeDetectorRef,
              protected productCollection: ProductCollection,
              protected notify: NotifyManager,
              protected store$: Store<any>) {
    super();
    this.shopManage$ = this.store$.select('shopManage');
  }
  
  ngOnInit() {
    this.subscribeObservable("_", () =>
      Observable
        .combineLatest(
          this.route.params,
          this.userCollection.getCollectionObservable(),
          this.licenseCollection.getCollectionObservable(),
          this.productCollection.getCollectionObservable()
        ).debounceTime(1000)
        .subscribe((z: any) => {
        const params                                             = z[0];
        const userCollection: MongoObservable.Collection<any>    = z[1];
        const licenseCollection: MongoObservable.Collection<any> = z[2];
        const productCollection: MongoObservable.Collection<any> = z[3];
        
        if (!!params['id']) {
          const user = userCollection.findOne({_id: params['id']});
          
          if (user) {
            this.user          = user;
            this.user['email'] = user['emails'][0]['address'];
            if (!this.user.hasOwnProperty('status')) {
              this.user['status'] = 1;
            }
            
            if (_.size(this.user['has_license']) === 1) {
              this.user['role'] = _.first(this.user['has_license'])['shop_role'];
              this.user['status']=_.first(this.user['has_license'])['status'];
            }
          } else {
            this.notify.error("sory_we_can_not_find_this_user_with_id: " + params['id']);
            this.back();
          }
        }
        const licenses = licenseCollection.collection.find().fetch();
        if (_.size(licenses) === 1) {
          this.license  = _.first(licenses);
          this.roles    = _.isArray(this.license['has_roles']) ? this.license['has_roles'] : [];
          this.products = productCollection.collection.find().fetch();
          
          this.changeDetectorRef.detectChanges();
          this.initPageJs();
        }
        
      })
    );
  }
  
  isProductHasUser(productId: string): boolean {
    if (!!this.user['_id']) {
      const product = _.find(this.license['has_product'], (p) => p['product_id'] === productId);
      if (product) {
        return !!_.find(product['has_user'], (hasUser) => hasUser['user_id'] === this.user['_id']);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  
  getProductName(productId: string) {
    const product = _.find(this.products, (p) => p['_id'] === productId);
    if (product) {
      return product['name'];
    } else {
      return "";
    }
  }
  
  private initPageJs() {
    let vm = this;
    if (this._vaidation) {
      this._vaidation.destroy();
    }
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
                                                                    'cashier_products': {
                                                                      required: true
                                                                    },
                                                                    'username': {
                                                                      required: true,
                                                                      minlength: 6,
                                                                      pattern: /^[a-zA-Z0-9 ]+$/
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
                                                                      minlength: 'Your username must consist of at least 6 characters',
                                                                        pattern: 'Not allow special char'
                                                                    },
                                                                    'email': {
                                                                      required: 'Please enter an email address',
                                                                      EMAIL: 'Please enter a valid email address'
                                                                    },
                                                                    'lastname': {
                                                                      required: 'Please enter a last name',
                                                                    },
                                                                    'cashier_products': {
                                                                      required: 'Product is required',
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
                                                                    vm.user['cashier_products'] = jQuery('#cashier_products').val();
                                                                    this.shopManage.saveCashier(vm.user);
                                                                  }
                                                                });
    jQuery('#cashier_products')['select2']();
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
