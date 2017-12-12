import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RouterActions} from "../../../../../../R/router/router.actions";
import {LicenseCollection} from "../../../../../../services/meteor-collections/licenses";
import {AbstractSubscriptionComponent} from "../../../../../../code/AbstractSubscriptionComponent";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import {PlanCollection} from "../../../../meteor-collections/plan";
import * as _ from 'lodash';
import {PriceCollection} from "../../../../../../services/meteor-collections/prices";
import {NotifyManager} from "../../../../../../services/notify-manager";
import {ProductCollection} from "../../../../../../services/meteor-collections/products";

@Component({
             // moduleId: module.id,
             selector: 'account-license-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountLicenseListComponent extends AbstractSubscriptionComponent implements OnInit {
  constructor(public routerActions: RouterActions,
              protected licenseCollection: LicenseCollection,
              protected planCollection: PlanCollection,
              protected pricingCollection: PriceCollection,
              protected productCollection: ProductCollection,
              protected notify: NotifyManager,
              protected elemenChangeDetector: ChangeDetectorRef) {
    super();
  }
  
  public licenseProduct: any[] = [];
  
  ngOnInit() {
    this.subscribeObservable("_", () =>
      Observable
        .combineLatest(
          this.licenseCollection.getCollectionObservable(),
          this.planCollection.getCollectionObservable(),
          this.pricingCollection.getCollectionObservable(),
          this.productCollection.getCollectionObservable(),
        ).subscribe((z: any) => {
        const licenseCollection: MongoObservable.Collection<any> = z[0];
        const planCollection: MongoObservable.Collection<any>    = z[1];
        const pricingCollection: MongoObservable.Collection<any> = z[2];
        const productCollection: MongoObservable.Collection<any> = z[3];
        
        const license = licenseCollection.collection.findOne();
        
        if (license) {
          if (_.isArray(license['has_product'])) {
            this.licenseProduct = [];
            _.forEach(license['has_product'], (p) => {
              const plan    = planCollection.collection.findOne({"_id": p['plan_id']});
              const pricing = pricingCollection.collection.findOne({"_id": p['pricing_id']});
              const product = productCollection.collection.findOne({"_id": p['product_id']});
              
              if (!!plan && !!pricing && !!product) {
                this.licenseProduct.push({
                                           productName: product['name'],
                                           pricingName: pricing['display_name'],
                                           additionEntity: p['addition_entity'],
                                           billingCycle: parseInt(p['billing_cycle']),
                                           purchaseDate: p['purchase_date'],
                                           expiryDate: p['expiry_date'],
                                           planId: p['plan_id']
                                         });
              } else {
                this.notify.error("Error", "can_not_find_plan_or_pricing");
              }
            });
            
            this.elemenChangeDetector.detectChanges();
          }
        } else {
          this.showNonelicenseInform();
          return;
        }
      }));
  }
  
  getLicenseBillingCycleText(cycleId) {
    if (isNaN(cycleId)) {
      return "";
    } else {
      switch (parseInt(cycleId)) {
        case 0:
          return "Lifetime";
        case 2:
          return "Annually";
        case 1:
          return "Monthly";
        default:
          return "";
      }
    }
  }
  
  protected showNonelicenseInform() {
    $('#none-license-inform')['modal']();
  }
  
  goProductsPage() {
    this.routerActions.go('cloud/default/c-product/list');
    $('#none-license-inform')['modal']('hide');
  }
  
  viewDetail(planId) {
    this.routerActions.go('cloud/default/account/license/plan/detail', {planId});
  }
}
