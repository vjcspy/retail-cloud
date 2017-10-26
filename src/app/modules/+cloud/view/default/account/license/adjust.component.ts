import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LicenseCollection} from "../../../../../../services/meteor-collections/licenses";
import {ProductCollection} from "../../../../../../services/meteor-collections/products";
import {PriceCollection} from "../../../../../../services/meteor-collections/prices";
import {ActivatedRoute, Params} from "@angular/router";
import {AbstractSubscriptionComponent} from "../../../../../../code/AbstractSubscriptionComponent";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import * as _ from 'lodash';
import {LogicException} from "../../../../../../code/LogicException";
import {UserCreditCollection} from "../../../../../../services/meteor-collections/user-credit";

@Component({
             // moduleId: module.id,
             selector: 'account-license-adjust',
             templateUrl: 'adjust.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountLicenseAdjustComponent extends AbstractSubscriptionComponent implements OnInit {
  public plan           = {
    extraUser: 0,
    cycle: 2
  };
  public productLicense = {};
  public product;
  public productPricing;
  public prices         = [];
  
  public userCreditBalance = 0;
  
  constructor(protected licenseCollection: LicenseCollection,
              protected productCollection: ProductCollection,
              protected pricingCollection: PriceCollection,
              protected userCreditCollection: UserCreditCollection,
              protected route: ActivatedRoute,
              protected changeDetectorRef: ChangeDetectorRef) {
    super();
  }
  
  ngOnInit() {
    this.subscribeObservable("_", () =>
      Observable.combineLatest(
        this.route.params,
        this.licenseCollection.getCollectionObservable(),
        this.productCollection.getCollectionObservable(),
        this.pricingCollection.getCollectionObservable(),
        this.userCreditCollection.getCollectionObservable(),
      ).subscribe((z: any) => {
        const params: Params                                        = z[0];
        const licenseCollection: MongoObservable.Collection<any>    = z[1];
        const productCollection: MongoObservable.Collection<any>    = z[2];
        const pricingCollection: MongoObservable.Collection<any>    = z[3];
        const userCreditCollection: MongoObservable.Collection<any> = z[4];
        
        const productId = params['productId'];
        const license   = licenseCollection.collection.findOne();
        const prices    = pricingCollection.collection.find().fetch();
        
        if (productId) {
          const product = _.find(productCollection.collection.find().fetch(), (p) => p['_id'] === productId);
          
          if (product) {
            this.product = product;
            
            const userCredit = userCreditCollection.collection.findOne();
            
            this.userCreditBalance = userCredit ? userCredit['balance'] || 0 : 0;
            
            this.prices = _.filter(prices, (_price) => {
              return _.isArray(this.product['has_pricing']) && _.indexOf(this.product['has_pricing'].map((_hasPricing) => _hasPricing['pricing_id']), _price['_id']) > -1;
            });
            
            if (license && _.isArray(license['has_product'])) {
              this.productLicense = _.find(license['has_product'], (l) => l['product_id'] === productId);
              if (this.productLicense) {
                // license has already bought this product
                this.plan['pricing'] = this.productLicense['pricing_id'];
                this.productPricing  = _.find(this.prices, (_p) => _p['_id'] === this.productLicense['pricing_id']);
                
                if (this.productPricing) {
                
                } else {
                  throw new LogicException("product_license_must_belong_one_of_pricing");
                }
              } else {
                // license has not yet bought this product
                this.initDefaultPricingPlan();
              }
            } else {
              // license has not yet bought any product
              this.initDefaultPricingPlan();
            }
            
            return this.changeDetectorRef.detectChanges();
          }
          
          throw new LogicException("wrong_data");
        }
      }));
  }
  
  protected getTrialPricing() {
    return _.find(this.prices, (_p) => _p['type'] === 'trial');
  }
  
  protected initDefaultPricingPlan(): void {
    const trialPricing = this.getTrialPricing();
    if (trialPricing) {
      this.plan['pricing_id'] = trialPricing['_id'];
    } else {
      this.plan['pricing_id'] = _.first(this.prices)['_id'];
    }
  }
  
  getMonthlyCost() {
    const pricing = this.currentSelectedPricing();
    if (parseInt(this.plan['cycle'] + '') === 1) {
      return pricing['cost_monthly'];
    } else if (parseInt(this.plan['cycle'] + '') === 2) {
      return pricing['cost_annually'] / 12;
    } else {
      throw new LogicException("can_not_find_cost_cycle");
    }
  }
  
  currentSelectedPricing() {
    return _.find(this.prices, (_p) => _p['_id'] === this.plan['pricing_id']);
  }
  
  isSelectSubscription(): boolean {
    const pricing = this.currentSelectedPricing();
    return !!pricing && pricing['type'] === 'subscription';
  }
  
  isNotSelectTrial(): boolean {
    const pricing = this.currentSelectedPricing();
    return !!pricing && pricing['type'] !== 'trial';
  }
  
  getCurrentExtraUser() {
    if (this.productLicense) {
      return this.productLicense['numOfExtraUser'] || 0;
    } else {
      return 0;
    }
  }
  
  changeExtraUser(value: number) {
    this.plan['extraUser'] += value;
    
    if (_.isNaN(this.plan['extraUser']) || this.plan['extraUser'] < 0) {
      this.plan['extraUser'] = 0;
    }
  }
  
  getTotals(): Object {
    return {
      credit: {
        creditPlan: 0,
        creditExtraUser: 0,
      },
      total: {
        costNewPlan: 0,
        costExtraUser: 0,
      }
    };
  }
  
  getGrandTotal(): number {
    return 0;
  }
  
  submitOrder() {
  }
}
