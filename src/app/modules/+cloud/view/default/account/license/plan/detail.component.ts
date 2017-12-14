import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LicenseCollection} from "../../../../../../../services/meteor-collections/licenses";
import {AbstractSubscriptionComponent} from "../../../../../../../code/AbstractSubscriptionComponent";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import * as _ from 'lodash';
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {PriceCollection} from "../../../../../../../services/meteor-collections/prices";
import {ProductCollection} from "../../../../../../../services/meteor-collections/products";
import {ConstrainDataHelper} from "../../../../../services/constrain-data-helper";
import {RouterActions} from "../../../../../../../R/router/router.actions";
import {ShopManageActions} from "../../../../../R/shop/actions";

@Component({
             // moduleId: module.id,
             selector: 'license-plan-detail',
             templateUrl: 'detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountLicensePlanDetailComponent extends AbstractSubscriptionComponent implements OnInit, OnDestroy {
  licenseHasProduct: any;
  product: any;
  pricing: any;
  
  private validationElem;
  protected urlDelete;
  
  constructor(protected activatedRoute: ActivatedRoute,
              protected licenseCollection: LicenseCollection,
              protected pricingCollection: PriceCollection,
              protected productCollection: ProductCollection,
              protected constrainDataHelper: ConstrainDataHelper,
              protected notify: NotifyManager,
              protected elemRef: ChangeDetectorRef,
              protected routerActions: RouterActions,
              protected shopActions: ShopManageActions) {
    super();
  }
  
  ngOnInit() {
    this.subscribeObservable("_", () =>
      Observable.combineLatest(
        this.activatedRoute.params,
        this.licenseCollection.getCollectionObservable(),
        this.pricingCollection.getCollectionObservable(),
        this.productCollection.getCollectionObservable(),
      ).subscribe((z: any) => {
        const params                                             = z[0];
        const licenseCollection: MongoObservable.Collection<any> = z[1];
        const licenses                                           = licenseCollection.collection.find().fetch();
        const {productId}                                        = params;
        const pricingCollection: MongoObservable.Collection<any> = z[2];
        const productCollection: MongoObservable.Collection<any> = z[3];
        
        if (_.size(licenses) === 1 && !!productId && _.isArray(licenses[0]['has_product']) && _.size(licenses[0]['has_product']) > 0) {
          this.licenseHasProduct = _.find(licenses[0]['has_product'], (licenseHasProduct) => licenseHasProduct['product_id'] === productId);
          if (this.licenseHasProduct) {
            this.product = productCollection.collection.findOne({"_id": this.licenseHasProduct['product_id']});
            this.pricing = pricingCollection.collection.findOne({"_id": this.licenseHasProduct['pricing_id']});
            
            this.elemRef.detectChanges();
            setTimeout(() => {
              this.initPageJs();
            });
          } else {
            this.notify.error("can_not_find_plan_data", "Error");
          }
        } else {
        }
      }));
  }
  
  private initPageJs() {
    let vm = this;
    if (this.validationElem) {
      this.validationElem.destroy();
    }
    this.validationElem = $('#plan-detail-form')['validate']({
                                                               errorClass: 'help-block text-left animated fadeInDown',
                                                               errorElement: 'div',
                                                               highlight(e) {
                                                                 $(e).closest('tr').removeClass('has-error').addClass('has-error');
                                                                 $(e).closest('.help-block').remove();
                                                               },
                                                               success(e) {
                                                                 $(e).closest('tr').removeClass('has-error');
                                                                 $(e).closest('.help-block').remove();
                                                               },
                                                               rules: {
                                                                 'base-url': {
                                                                   required: true,
                                                                   url: true
                                                                 },
                                                               },
                                                               messages: {
                                                                 'base-url': {
                                                                   required: 'Please enter a url'
                                                                 },
                                                               },
                                                               submitHandler() {
                                                                 vm.shopActions
                                                                   .saveProductLicense(vm.licenseHasProduct);
                                                               }
                                                             });
  }
  
  getBillingCycleName(b) {
    const name = ConstrainDataHelper.getBillingCycleName(b);
    
    return !!name ? name : "-";
  }
  
  removeBaseUrl() {
    _.remove(this.licenseHasProduct['base_url'], (b) => b === this.urlDelete);
    this.closePopupModalDeleteUrl();
  }
  
  openPopupModalDeleteUrl(url) {
    this.urlDelete = url;
    $('#delete-url')['modal']('show');
  }
  
  closePopupModalDeleteUrl() {
    $('#delete-url')['modal']('hide');
  }
  
  requestNewBaseUrl() {
    this.licenseHasProduct['base_url'].push({
                                              request: true,
                                              in_use: false,
                                              is_valid: false,
                                              url: "",
                                              api_version: ""
                                            });
  }
  
  ngOnDestroy() {
    if (this.validationElem) {
      this.validationElem.destroy();
    }
    super.ngOnDestroy();
  }
}
