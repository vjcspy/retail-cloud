import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {LicenseCollection} from "../../../../../services/meteor-collections/licenses";
import {MongoObservable} from "meteor-rxjs";
import {RouterActions} from "../../../../../R/router/router.actions";
import {NotifyManager} from "../../../../../services/notify-manager";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {PriceCollection} from "../../../../../services/meteor-collections/prices";
import * as _ from 'lodash';
import {ConstrainDataHelper} from "../../../services/constrain-data-helper";
import {ValidateData} from "../../../services/validate-data";
import {UserCollection} from "../../../../../services/meteor-collections/users";
import {LicenseActions} from "../../../R/license/actions";
import * as moment from 'moment';

@Component({
             // moduleId: module.id,
             selector: 'license-form',
             templateUrl: 'license-form.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class LicenseFormComponent extends AbstractSubscriptionComponent implements OnInit, OnDestroy {
  public license            = {
    shop_owner_id: 'createNew',
    status: 1
  };
  public licenseHasProducts = [];
  public user               = {
    profile: {}
  };
  public products           = [];
  public prices             = [];
  public data               = {};
  public users;
  
  protected formValidation;
  
  constructor(protected route: ActivatedRoute,
              protected licenseCollection: LicenseCollection,
              protected notify: NotifyManager,
              protected changeDetectorRef: ChangeDetectorRef,
              protected productCollection: ProductCollection,
              protected pricingCollection: PriceCollection,
              protected userCollection: UserCollection,
              protected routerActions: RouterActions,
              protected licenseActions: LicenseActions) {
    super();
  }
  
  ngOnInit() {
    this.subscribeObservable("_", () => Observable.combineLatest(
      this.route.params,
      this.licenseCollection.getCollectionObservable(),
      this.productCollection.getCollectionObservable(),
      this.pricingCollection.getCollectionObservable(),
      this.userCollection.getCollectionObservable(),
    ).subscribe((z: any) => {
      const params                                             = z[0];
      const licenseCollection: MongoObservable.Collection<any> = z[1];
      const productCollection: MongoObservable.Collection<any> = z[2];
      const pricingCollection: MongoObservable.Collection<any> = z[3];
      const userCollection: MongoObservable.Collection<any>    = z[4];
      
      this.products = productCollection.collection.find().fetch();
      this.prices   = pricingCollection.collection.find().fetch();
      
      this.users              = userCollection.collection.find().fetch();
      this.licenseHasProducts = [];
      
      if (!!params['id']) {
        const license = licenseCollection.findOne({_id: params['id']});
        
        if (!!license) {
          this.license = license;
          
          _.forEach(this.products, (p) => {
            const existedProductLicense = _.find(this.license['has_product'], (_p) => _p['product_id'] === p['_id']);
            if (!!existedProductLicense) {
              this.licenseHasProducts.push(Object.assign({}, {...p}, {...existedProductLicense}, {
                is_new: false,
                checked: true,
              }));
            } else {
              this.licenseHasProducts.push(Object.assign({}, {...p}, {
                is_new: true,
                checked: false,
                status: 1,
                purchase_date: null,
                last_invoice: null,
                base_url: [],
                product_id: p['_id'],
                addition_entity: 1,
                billing_cycle: _.last(ConstrainDataHelper.getBillingCycleData())['billingCycle'],
                expiry_date: new Date()
              }));
            }
          });
          
          this.changeDetectorRef.detectChanges();
          setTimeout(() => {
            this.initPageJs();
          });
        } else {
          this.notify.error('can_not_find_license_with_id: ' + params['id']);
          this.goBack();
        }
      } else {
        _.forEach(this.products, (p) => {
          this.licenseHasProducts.push(Object.assign({}, {...p}, {
            is_new: true,
            checked: false,
            status: 1,
            purchase_date: null,
            last_invoice: null,
            base_url: [],
            product_id: p['_id'],
            addition_entity: 1,
            billing_cycle: _.last(ConstrainDataHelper.getBillingCycleData())['billingCycle'],
            expiry_date: new Date()
          }));
        });
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
          this.initPageJs();
        });
      }
    }));
  }
  
  private initPageJs() {
    let vm = this;
    if (this.formValidation) {
      this.formValidation.destroy();
    }
    
    // datepicker
    _.forEach(this.licenseHasProducts, (p) => {
      if (!p['expiry_date']) {
        p['expiry_date'] = moment().toDate();
      }
      jQuery("#val-expire_date" + p['product_id'])['daterangepicker']({
                                                                        startDate: p['expiry_date'],
                                                                        locale: {
                                                                          format: 'YYYY-MM-DD'
                                                                        },
                                                                        singleDatePicker: true,
                                                                        showDropdowns: true
                                                                      },
                                                                      (start) => {
                                                                        p['expiry_date'] = start.toDate();
                                                                      });
    });
    
    // user select2
    jQuery('#val-owner')['select2']().on('change', function (e) {
      jQuery(this)['valid']();
      vm.license['shop_owner_id'] = jQuery(this).val();
      vm.changeDetectorRef.detectChanges();
    });
    
    let initLicenseValidationMaterial = () => {
      jQuery('.js-validation-license')['validate']({
                                                     errorClass: 'help-block text-right animated fadeInDown',
                                                     errorElement: 'div',
                                                     errorPlacement: (error, e) => {
                                                       jQuery(e).parents('.form-group > div').append(error);
                                                     },
                                                     highlight: e => {
                                                       let elem = jQuery(e);
          
                                                       elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                                                       elem.closest('.help-block').remove();
                                                     },
                                                     success: e => {
                                                       let elem = jQuery(e);
          
                                                       elem.closest('.form-group').removeClass('has-error');
                                                       elem.closest('.help-block').remove();
                                                     },
                                                     rules: {
                                                       'val-owner': {
                                                         required: true
                                                       },
                                                       'status': {
                                                         required: true
                                                       },
                                                       'val-status': {
                                                         required: true
                                                       },
                                                       'firstname': {
                                                         required: true
                                                       },
                                                       'lastname': {
                                                         required: true
                                                       },
                                                       'username': {
                                                         required: true,
                                                         minlength: 6
                                                       },
                                                       'email': {
                                                         required: true,
                                                         minlength: 6,
                                                         email: true
                                                       },
                                                     },
                                                     messages: {
                                                       'val-status': {
                                                         required: 'Please select status',
                                                       },
                                                     },
                                                     submitHandler: form => {
                                                       vm.licenseActions.saveLicense(vm.license, vm.licenseHasProducts, vm.user);
                                                     }
                                                   });
    };
    this.formValidation               = initLicenseValidationMaterial();
  }
  
  getBillingCycleData() {
    return ConstrainDataHelper.getBillingCycleData();
  }
  
  addBasedUrl(product, url) {
    if (ValidateData.validateUrl(url)) {
      if (_.indexOf(_.map(product['base_url'], u => u['url']), url) === -1) {
        product['base_url'].push({
                                   in_use: true,
                                   is_valid: true,
                                   url,
                                 });
      } else {
        this.notify.warning("url_already_existed");
      }
    } else {
      this.notify.warning("url_not_match");
    }
  }
  
  removeBaseUrl(product, url) {
    _.remove(product['base_url'], url);
  }
  
  isPricingOfProduct(pricing, product) {
    return _.isArray(product['has_pricing']) && _.indexOf(_.map(product['has_pricing'], (_p) => _p['pricing_id']), pricing['_id']) > -1;
  }
  
  public isEditingLicense(): boolean {
    if (!this.data.hasOwnProperty('isEditingLicense')) {
      this.data['isEditingLicense'] = !!this.license && !!this.license['_id'];
    }
    
    return this.data['isEditingLicense'];
  }
  
  currentSelectedPricing() {
    return _.find(this.prices, (_p) => _p['_id'] === this.license['pricing_id']);
  }
  
  isNotSelectTrial(): boolean {
    const pricing = this.currentSelectedPricing();
    return !!pricing && pricing['type'] !== 'trial';
  }
  
  goBack() {
    this.routerActions.go('cloud/default/license/list');
  }
  
  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.formValidation) {
      this.formValidation.destroy();
    }
  }
}
