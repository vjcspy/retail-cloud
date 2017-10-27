import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, AfterViewInit} from '@angular/core';
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import {NotifyManager} from "../../../../../services/notify-manager";
import {RouterActions} from "../../../../../R/router/router.actions";
import {PriceCollection} from "../../../../../services/meteor-collections/prices";
import * as moment from 'moment';
import * as _ from 'lodash';
import {ProductActions} from "../../../R/product/actions";
import {ProductState} from "../../../R/product/state";
import {Store} from "@ngrx/store";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";

@Component({
  // moduleId: module.id,
  selector: 'product-api',
  templateUrl: 'api.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductApiComponent extends AbstractSubscriptionComponent implements OnInit, AfterViewInit {
  public product = {
    pricings: [],
    versions: [],
    apiVersions: []
  };
  
  public productState$: Observable<ProductState>;
  
  constructor(
    public    productCollection: ProductCollection,
    public    priceCollection: PriceCollection,
    protected route: ActivatedRoute,
    protected changeDetectorRef: ChangeDetectorRef,
    protected notify: NotifyManager,
    protected routerActions: RouterActions,
    protected productActions: ProductActions,
    protected store$: Store<any>
  ) {
    super();
    this.productState$ = this.store$.select('product');
    console.log('hihi');
  }
  
  ngOnInit() {
    this.subscribeObservable("_", () => Observable.combineLatest(
      this.route.params,
      this.productCollection.getCollectionObservable(),
      this.priceCollection.getCollectionObservable(),
    ).subscribe((z: any) => {
      const params = z[0];
      const productCollection: MongoObservable.Collection<any> = z[1];
      const priceCollection: MongoObservable.Collection<any> = z[2];
      
      if (!!params['id']) {
        const product = productCollection.findOne({_id: params['id']});
        
        if (!!product) {
          this.product = product;
          
        } else {
          this.notify.error('can_not_find_product_with_id: ' + params['id']);
          this.goBack();
        }
      }
      this.changeDetectorRef.detectChanges();
      setTimeout(() => {
        this.initPageJs();
      }, 100);
    }));
  }
  
  ngAfterViewInit() {
  
  }
  
  private initPageJs() {
  
  }
  
  isEditingProduct() {
    return !!this.product && !!this.product['_id'];
  }
  
  goBack() {
    this.routerActions.go('cloud/default/product/list');
  }
}
