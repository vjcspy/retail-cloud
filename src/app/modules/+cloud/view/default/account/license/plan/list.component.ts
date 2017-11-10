import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PlanCollection} from "../../../../../meteor-collections/plan";
import {ProductCollection} from "../../../../../../../services/meteor-collections/products";
import {PriceCollection} from "../../../../../../../services/meteor-collections/prices";
import {AbstractSubscriptionComponent} from "../../../../../../../code/AbstractSubscriptionComponent";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import * as _ from 'lodash';
import {RouterActions} from "../../../../../../../R/router/router.actions";

@Component({
             // moduleId: module.id,
             selector: 'account-license-plan-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountLicensePlanListComponent extends AbstractSubscriptionComponent implements OnInit {
  protected products: any[];
  protected pricings: any[];
  
  resolvedData: boolean = false;
  
  constructor(public planCollection: PlanCollection,
              protected productCollection: ProductCollection,
              protected pricingCollection: PriceCollection,
              protected routerActions: RouterActions,
              protected changeDetector: ChangeDetectorRef) {
    super();
  }
  
  ngOnInit() {
    this.subscribeObservable("_", () =>
      Observable.combineLatest(
        this.productCollection.getCollectionObservable(),
        this.pricingCollection.getCollectionObservable(),
        this.planCollection.getCollectionObservable(),
      ).subscribe((z: any) => {
        const productCollection: MongoObservable.Collection<any> = z[0];
        const pricingCollection: MongoObservable.Collection<any> = z[1];
        
        this.products = productCollection.collection.find().fetch();
        this.pricings = pricingCollection.collection.find().fetch();
        
        this.resolvedData = true;
        this.changeDetector.detectChanges();
      }));
  }
  
  getTableConfig() {
    let vm = this;
    return {
      canCreate: false,
      actionsColumn: {
        edit: {
          name: "Invoice"
        }, remove: false
      },
      columns: [
        {data: "product_id", title: "Product", searchable: true},
        {data: "pricing_id", title: "Pricing", searchable: true},
        {data: "pricing_cycle", title: "Cycle", searchable: true},
        {data: "prev_pricing_id", title: "Prev Pricing", searchable: true},
        {data: "prev_pricing_cycle", title: "Prev Cycle", searchable: true},
        {data: "cost_new_plan", title: "Cost new plan", searchable: true},
        {data: "credit_change_plan", title: "Credit change plan", searchable: true},
        {data: "discount_amount", title: "Discount"},
        {data: "grand_total", title: "Grandtotal"},
      ],
      columnDefs: [
        {
          targets: [0],
          render(data) {
            if (_.isArray(vm.products)) {
              const product = _.find(vm.products, (_p) => _p['_id'] === data);
              return product ? product['name'] : data;
            } else {
              return data;
            }
          }
        },
        {
          targets: [1, 3],
          render(data) {
            if (_.isArray(vm.pricings)) {
              const pricings = _.find(vm.pricings, (_p) => _p['_id'] === data);
              return pricings ? pricings['display_name'] : data;
            } else {
              return data;
            }
          }
        },
        {
          targets: [2, 4],
          render(data) {
            return parseInt(data) === 1 ? "Monthly" : "Annually";
          }
        }
      ],
      bFilter: true,
      sDom: 'ltp'
    };
  }
  
  handleTableEvent($event) {
    switch ($event['type']) {
      case "CLICK_EDIT":
        return this.routerActions.go('cloud/default/account/license/checkout', {orderType: 'plan', orderId: $event['data']});
      
      default:
    }
  }
}
