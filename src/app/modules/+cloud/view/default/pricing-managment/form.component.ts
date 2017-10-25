import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PriceCollection} from "../../../../../services/meteor-collections/prices";
import {ActivatedRoute} from "@angular/router";
import {RouterActions} from "../../../../../R/router/router.actions";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import {NotifyManager} from "../../../../../services/notify-manager";
import {PricingState} from "../../../R/pricing/state";
import {Store} from "@ngrx/store";
import {PricingActions} from "../../../R/pricing/actions";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {PriceTypeCollection} from "../../../../../services/meteor-collections/price-type";
import * as _ from 'lodash';
import {OptionInterface} from "../../../../../code/contract/option-interface";

@Component({
             // moduleId: module.id,
             selector: 'pricing-form',
             templateUrl: 'form.component.html'
           })

export class PricingFormComponent extends AbstractSubscriptionComponent implements OnInit, OnDestroy {
  public pricing                       = {
    type: 'subscription',
    visibility: 1,
  };
  protected data                       = {};
  protected pricingState$: Observable<PricingState>;
  protected validate;
  public priceTypes: OptionInterface[] = [];
  
  constructor(public pricingCollection: PriceCollection,
              protected route: ActivatedRoute,
              protected changeDetectorRef: ChangeDetectorRef,
              protected routerActions: RouterActions,
              protected pricingActions: PricingActions,
              protected priceTypeCollection: PriceTypeCollection,
              protected notify: NotifyManager,
              protected store$: Store<any>) {
    super();
    this.pricingState$ = this.store$.select('pricing');
  }
  
  ngOnInit() {
    this.initPageJs();
    
    this.subscribeObservable('_', () => Observable.combineLatest(
      this.route.params,
      this.pricingCollection.getCollectionObservable(),
      this.priceTypeCollection.getCollectionObservable()
    ).subscribe((z: any) => {
      const params                                               = z[0];
      const priceCollection: MongoObservable.Collection<any>     = z[1];
      const priceTypeCollection: MongoObservable.Collection<any> = z[2];
      
      if (_.size(this.priceTypes) === 0) {
        const priceTypes = priceTypeCollection.collection.find({}).fetch();
        _.forEach(priceTypes, (t) => {
          this.priceTypes.push({
                                 value: t['name'],
                                 name: t['label']
                               });
        });
      }
      
      if (!!params['id']) {
        const product = priceCollection.findOne({_id: params['id']});
        
        if (!!product) {
          this.pricing = product;
          
        } else {
          this.notify.error('can_not_find_product_with_id: ' + params['id']);
          this.goBack();
        }
      }
      
      this.changeDetectorRef.detectChanges();
    }));
  }
  
  private initPageJs() {
    let vm        = this;
    this.validate =
      jQuery('.js-validation-pricing')['validate']({
                                                     errorClass: 'help-block text-right animated fadeInDown',
                                                     errorElement: 'div',
                                                     errorPlacement(error, e) {
                                                       jQuery(e).parents('.form-group > div').append(error);
                                                     },
                                                     highlight(e) {
                                                       const elem = jQuery(e);
          
                                                       elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                                                       elem.closest('.help-block').remove();
                                                     },
                                                     success(e) {
                                                       const elem = jQuery(e);
          
                                                       elem.closest('.form-group').removeClass('has-error');
                                                       elem.closest('.help-block').remove();
                                                     },
                                                     rules: {
                                                       'val-display_name': {
                                                         required: true
                                                       },
                                                       'val-type': {
                                                         required: true
                                                       },
                                                       // 'val-visibility': {
                                                       //   required: true
                                                       // },
                                                       'val-nousers': {
                                                         required: true,
                                                         number: true
                                                       },
                                                       'val-cost_monthly': {
                                                         required: true,
                                                         number: true
                                                       },
                                                       'val-cost_annually': {
                                                         required: true,
                                                         number: true
                                                       },
                                                       'val-cost_adding': {
                                                         required: true,
                                                         number: true
                                                       },
                                                     },
                                                     messages: {
                                                       'val-display_name': {
                                                         required: 'Please enter pricing display name',
                                                       },
                                                       'val-type': {
                                                         required: 'Please select one pricing type',
                                                       },
                                                       // 'val-visibility': {
                                                       //   required: 'Please select visibility of pricing',
                                                       // }
                                                     },
                                                     submitHandler() {
                                                       vm.pricingActions.savePricing(vm.pricing);
                                                     }
                                                   });
  }
  
  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.validate) {
      this.validate.destroy();
    }
  }
  
  isEditingPricing() {
    return !!this.pricing && !!this.pricing['_id'];
  }
  
  goBack() {
    this.routerActions.go('cloud/default/pricing/list');
  }
}
