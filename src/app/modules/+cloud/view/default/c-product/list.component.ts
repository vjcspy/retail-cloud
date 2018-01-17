import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LicenseCollection} from "../../../../../services/meteor-collections/licenses";
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import {Store} from "@ngrx/store";
import {AccountState} from "../../../../../R/account/account.state";
import {NotifyManager} from "../../../../../services/notify-manager";
import {PriceCollection} from "../../../../../services/meteor-collections/prices";
import * as _ from 'lodash';
import {ProductService} from "../../../R/product/service";
import {RouterActions} from "../../../../../R/router/router.actions";

@Component({
             // moduleId: module.id,
             selector: 'product-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class CProductListComponent extends AbstractSubscriptionComponent implements OnInit {
  public accountState$: Observable<AccountState>;
  public license;
  public products = [];
  
  constructor(protected licenseCollection: LicenseCollection,
              protected productCollection: ProductCollection,
              protected priceCollection: PriceCollection,
              protected productService: ProductService,
              protected store$: Store<any>,
              protected changeDetectorRef: ChangeDetectorRef,
              protected routerActions: RouterActions,
              protected notify: NotifyManager) {
    super();
    this.accountState$ = this.store$.select('account');
  }
  
  ngOnInit() {
    this.subscribeObservable("_", () =>
      Observable.combineLatest(
        this.productCollection.getCollectionObservable(),
        this.licenseCollection.getCollectionObservable(),
        this.priceCollection.getCollectionObservable(),
        this.accountState$
      ).subscribe((z: any) => {
        const productCollection: MongoObservable.Collection<any> = z[0];
        const licenseCollection: MongoObservable.Collection<any> = z[1];
        const priceCollection: MongoObservable.Collection<any>   = z[2];
        const accountState: AccountState                         = z[3];
        
        this.license   = licenseCollection.collection.findOne();
        const products = productCollection.find().fetch();
        const prices   = priceCollection.collection.find().fetch();
        this.products  = [];
        
        if (this.license) {
          if (accountState.user['_id'] !== this.license['shop_owner_id']) {
            this.notify.error("you_are_not_shop_owner");
            
            return;
          }
          _.forEach(products, (p) => {
            let productInfo = Object.assign({}, {...p}, {
              canTrial: false,
              canPurchase: false
            });
            
            let licenseHasProduct;
            if (_.isArray(this.license['has_product'])) {
              licenseHasProduct = _.find(this.license['has_product'], (_p) => _p['product_id'] === p['_id']);
              if (!licenseHasProduct) {
                productInfo.canTrial = this.productService.isProductHasTrialPricing(p, prices);
              }
              productInfo.canPurchase = true;
            } else {
              productInfo.canTrial    = this.productService.isProductHasTrialPricing(p, prices);
              productInfo.canPurchase = this.productService.isProductCanPurchase(p, prices);
            }
            
            this.products.push(productInfo);
          });
        } else {
          _.forEach(products, (p) => {
            let productInfo = Object.assign({}, {...p}, {
              canTrial: false,
              canPurchase: false
            });
            
            productInfo.canTrial    = this.productService.isProductHasTrialPricing(p, prices);
            productInfo.canPurchase = this.productService.isProductCanPurchase(p, prices);
            
            this.products.push(productInfo);
          });
        }
        
        this.changeDetectorRef.detectChanges();
      })
    );
  }
  
  getCPos() {
    return _.find(this.products, (p) => p['code'] === 'xpos');
  }
  
  demo(productCode) {
    switch (productCode) {
      case "xpos":
        return window.location.href = "https://sales.connectpos.com";
      default:
        alert("Not support this product");
    }
  }
  
  adjustPlan(productId) {
    this.routerActions.go('cloud/default/account/license/adjust', productId);
  }
}
