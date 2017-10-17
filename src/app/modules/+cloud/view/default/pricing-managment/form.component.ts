import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PriceCollection} from "../../../../../services/meteor-collections/prices";
import {ActivatedRoute} from "@angular/router";
import {RouterActions} from "../../../../../R/router/router.actions";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import {NotifyManager} from "../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'pricing-form',
             templateUrl: 'form.component.html'
           })

export class PricingFormComponent implements OnInit {
  public pricing = {};
  protected data = {};
  
  constructor(public pricingCollection: PriceCollection,
              protected route: ActivatedRoute,
              protected changeDetectorRef: ChangeDetectorRef,
              protected routerActions: RouterActions,
              protected notify: NotifyManager) { }
  
  ngOnInit() {
    Observable.combineLatest(
      this.route.params,
      this.pricingCollection.getCollectionObservable()
    ).subscribe((z: any) => {
      const params                                           = z[0];
      const priceCollection: MongoObservable.Collection<any> = z[1];
      
      if (!!params['id']) {
        const product = priceCollection.findOne({_id: params['id']});
        
        if (!!product) {
          this.pricing = product;
          
          this.changeDetectorRef.detectChanges();
        } else {
          this.notify.error('can_not_find_product_with_id: ' + params['id']);
          this.goBack();
        }
      }
    });
  }
  
  isEditingPricing() {
    return !!this.pricing && !!this.pricing['_id'];
  }
  
  goBack() {
    this.routerActions.go('cloud/default/product/list');
  }
}
