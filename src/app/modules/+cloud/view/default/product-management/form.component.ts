import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
             selector: 'product-form',
             templateUrl: 'form.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class ProductFormComponent extends AbstractSubscriptionComponent implements OnInit {
  public product = {
    pricings: [],
    versions: []
  };
  public prices  = [];
  public data    = {};
  
  protected validation;
  
  public productState$: Observable<ProductState>;
  
  constructor(public productCollection: ProductCollection,
              public priceCollection: PriceCollection,
              protected route: ActivatedRoute,
              protected changeDetectorRef: ChangeDetectorRef,
              protected notify: NotifyManager,
              protected routerActions: RouterActions,
              protected productActions: ProductActions,
              protected store$: Store<any>) {
    super();
    this.productState$ = this.store$.select('product');
  }
  
  ngOnInit() {
    this.subscribeObservable("_", () => Observable.combineLatest(
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
  
  private initPageJs() {
    let vm          = this;
    this.validation = jQuery('.js-validation-product')['validate']({
                                                                     errorClass: 'help-block text-right animated fadeInDown',
                                                                     errorElement: 'div',
                                                                     errorPlacement(error, e) {
                                                                       jQuery(e).parents('.form-group > div').append(error);
                                                                     },
                                                                     highlight(e) {
                                                                       let elem = jQuery(e);
        
                                                                       elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                                                                       elem.closest('.help-block').remove();
                                                                     },
                                                                     success(e) {
                                                                       let elem = jQuery(e);
        
                                                                       elem.closest('.form-group').removeClass('has-error');
                                                                       elem.closest('.help-block').remove();
                                                                     },
                                                                     rules: {
                                                                       'val-product_name': {
                                                                         required: true
                                                                       },
                                                                       'val-product_code': {
                                                                         required: true
                                                                       },
                                                                       'val-version_name': {
                                                                         required: true
                                                                       },
                                                                       'val-version': {
                                                                         required: true
                                                                       },
                                                                       'val-pricings': {
                                                                         required: true,
                                                                         minlength: 1
                                                                       },
                                                                     },
                                                                     messages: {
                                                                       'val-product_name': {
                                                                         required: 'Please enter product name',
                                                                       },
                                                                       'val-product_code': {
                                                                         required: 'Please enter product code',
                                                                       },
                                                                       'val-pricings': {
                                                                         required: 'Please select at least choose one pricing',
                                                                       },
                                                                     },
                                                                     submitHandler() {
                                                                       let pricings              = jQuery("#val-pricings").val();
                                                                       vm.product['has_pricing'] = [];
                                                                       if (_.isArray(pricings)) {
                                                                         _.forEach(pricings, (pricing_id) => {
                                                                           if (_.isArray(vm.product['has_pricing'])) {
                                                                             vm.product['has_pricing'].push({pricing_id});
                                                                           }
                                                                         });
                                                                       } else {
                                                                         vm.notify.error("wrong_format_pricing");
                                                                         return;
                                                                       }
                                                                       vm.productActions.saveProduct(vm.product);
                                                                     }
                                                                   });
    
    jQuery("#val-pricings")['select2']();
  }
  
  isEditingProduct() {
    return !!this.product && !!this.product['_id'];
  }
  
  goBack() {
    this.routerActions.go('cloud/default/product/list');
  }
  
  addVersion() {
    this.product.versions.push({
                                 name: "",
                                 version: "",
                                 changelog: "",
                                 created_at: moment().toDate(),
                                 updated_at: moment().toDate(),
                               });
  }
  
  removeVersion(version) {
    _.remove(this.product.versions, version);
  }
  
  isSelectedPrice(id) {
    return _.isArray(this.product['has_pricing']) && _.indexOf(this.product['has_pricing'].map((_p) => _p['pricing_id']), id) > -1;
  }
}
