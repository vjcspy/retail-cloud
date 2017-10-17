import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import {NotifyManager} from "../../../../../services/notify-manager";
import {RouterActions} from "../../../../../R/router/router.actions";
import {PriceCollection} from "../../../../../services/meteor-collections/prices";

@Component({
             // moduleId: module.id,
             selector: 'product-form',
             templateUrl: 'form.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class ProductFormComponent implements OnInit {
  public product = {};
  public prices  = [];
  public data    = {};
  
  constructor(public productCollection: ProductCollection,
              public priceCollection: PriceCollection,
              protected route: ActivatedRoute,
              protected changeDetectorRef: ChangeDetectorRef,
              protected notify: NotifyManager,
              protected routerActions: RouterActions) { }
  
  ngOnInit() {
    Observable.combineLatest(
      this.route.params,
      this.productCollection.getCollectionObservable(),
      this.priceCollection.getCollectionObservable(),
    ).subscribe((z: any) => {
      const params                                             = z[0];
      const productCollection: MongoObservable.Collection<any> = z[1];
      const priceCollection: MongoObservable.Collection<any>   = z[2];
      
      this.prices = priceCollection.find().fetch();
      
      if (!!params['id']) {
        const product = productCollection.findOne({_id: params['id']});
        
        if (!!product) {
          this.product = product;
          
          this.changeDetectorRef.detectChanges();
        } else {
          this.notify.error('can_not_find_product_with_id: ' + params['id']);
          this.goBack();
        }
      }
    });
  }
  
  isEditingProduct() {
    if (!this.data.hasOwnProperty('isEditingProduct')) {
      this.data['isEditingProduct'] = !!this.product && !!this.product['_id'];
    }
    
    return this.data['isEditingProduct'];
  }
  
  goBack() {
    this.routerActions.go('cloud/default/product/list');
  }
}
