import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, AfterViewInit} from '@angular/core';
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import {NotifyManager} from "../../../../../services/notify-manager";
import {RouterActions} from "../../../../../R/router/router.actions";
import * as _ from 'lodash';
import {ProductActions} from "../../../R/product/actions";
import {ProductState} from "../../../R/product/state";
import {Store} from "@ngrx/store";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";

@Component({
  // moduleId: module.id,
  selector:        'product-api',
  templateUrl:     'api.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductApiComponent extends AbstractSubscriptionComponent implements OnInit, AfterViewInit {
  public product = {
    pricings:    [],
    versions:    [],
    apiVersions: []
  };
  
  public productState$: Observable<ProductState>;
  
  constructor(public    productCollection: ProductCollection,
              protected route: ActivatedRoute,
              protected router: Router,
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
    ).subscribe((z: any) => {
      const params                                             = z[0];
      const productCollection: MongoObservable.Collection<any> = z[1];
      
      if (!!params['id']) {
        const product = productCollection.findOne({_id: params['id']});
        
        if (!!product) {
          this.product = product;
          if( typeof(this.product.apiVersions) === 'undefined' ) {
            this.product.apiVersions = [];
          }
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
    let url = this.router.url;
    $('ul.nav-tabs li:nth-child(1)').attr('class', '');
    $('ul.nav-tabs li:nth-child(2)').attr('class', 'active');
    $('ul.nav-tabs li:nth-child(2) a').attr('href', '/#' + url);
  
    if( url.search('api') !== -1 ) {
      url = url.replace('api', 'general');
    } else {
      url = url.replace('edit', 'edit/general');
    }
    $('ul.nav-tabs li:first-child a').attr('href', '/#' + url);
  }
  
  private initPageJs() {
    let vm = this;
    
    $('#product-api')['validate']({
      errorClass:   'help-block text-left animated fadeInDown',
      errorElement: 'div',
      highlight(e) {
        $(e).closest('tr').removeClass('has-error').addClass('has-error');
        $(e).closest('.help-block').remove();
      },
      success(e) {
        $(e).closest('tr').removeClass('has-error');
        $(e).closest('.help-block').remove();
      },
      submitHandler() {
        let index = $('#product-api-index').val();
        let api = {
          name: $('#product-api-name').val(),
          code: $('#product-api-code').val(),
        };
        if( index === '-1' ) {
          vm.product.apiVersions.push(api);
        } else {
          vm.product.apiVersions[index] = api;
        }
  
        vm.productActions.updateProductApi(vm.product);
        vm.resetModalApi();
      }
    });
  }
  
  isEditingProduct() {
    return !!this.product && !!this.product['_id'];
  }
  
  goBack() {
    this.routerActions.go('cloud/default/product/list');
  }
  
  showProductApi(index) {
    this.resetModalApi();
    $('#product-api-index').val(index);
    $('#product-api-code').val(this.product.apiVersions[index]['code']);
    $('#product-api-name').val(this.product.apiVersions[index]['name']);
    $('#product-api-package').removeAttr('required');
  }
  
  resetModalApi() {
    $('#product-api-index').val('-1');
    $('#product-api-code').val('');
    $('#product-api-name').val('');
    $('#product-api-package').val('');
    $('#product-api-package').prop('required',true);
    $('tr[class="has-error"]').find('div.help-block').remove();
    $('tr[class="has-error"]').removeClass('has-error');
    $('.close').click();
  }
}
