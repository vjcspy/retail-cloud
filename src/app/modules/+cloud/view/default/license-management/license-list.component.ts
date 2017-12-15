import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LicenseCollection} from "../../../../../services/meteor-collections/licenses";
import * as _ from 'lodash';
import {RouterActions} from "../../../../../R/router/router.actions";
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";

@Component({
             // moduleId: module.id,
             selector: 'license-list',
             templateUrl: 'license-list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class LicenseListComponent extends AbstractSubscriptionComponent implements OnInit {
  resolvedData: boolean = false;
  protected products;
  
  constructor(public licenseCollection: LicenseCollection,
              protected productCollection: ProductCollection,
              protected detechChange: ChangeDetectorRef,
              protected routerActions: RouterActions) {
    super();
  }
  
  public tableConfig = {
    actionsColumn: {edit: true, detail: true},
    columns: [
      {data: "_id", title: "License ID"},
      {data: "key", title: "License Key"},
      {data: "shop_owner_username", title: "Shop owner"},
      {data: "has_product", title: "Products"},
      {data: "status", title: "Status"}
    ],
    columnDefs: [
      {className: "", orderable: false, targets: [0]},
      {className: "", orderable: false, targets: [1]},
      {
        targets: [2], render: data => data ? data : "",
      },
      {
        className: "", orderable: false,
        targets: [3],
        render: (data, type, row) => {
          let _html = "";
          let text  = "";
          if (_.isArray(data)) {
            _.forEach(data, product => {
              const _p = _.find(this.products, (_product) => _product['_id'] === product['product_id']);
              if (_p) {
                _html += `<span class="label label-warning">${_p['name']}</span>&nbsp;`;
              } else {
                _html += `<span class="label label-warning">${product['product_id']}</span>&nbsp;`;
              }
            });
          }
          return _html;
        }
      },
      {
        className: "text-center",
        orderable: false, targets: [4],
        render: data => {
          if (parseInt(data) === 1) {
            return `<span class="label label-success">Activated</span>`;
          } else if (parseInt(data) === 0) {
            return `<span class="label label-danger">Deactivated</span>`;
          } else if (parseInt(data) === 2) {
            return `<span class="label label-default">Fresh</span>`;
          }
        }
      }
    ],
    bFilter: true,
    sDom: 'ltp'
  };
  
  ngOnInit() {
    this.subscribeObservable("_", () =>
      Observable.combineLatest(
        this.productCollection.getCollectionObservable(),
        this.licenseCollection.getCollectionObservable()
      ).subscribe((z: any) => {
        const productCollection: MongoObservable.Collection<any> = z[0];
        this.products                                            = productCollection.collection.find().fetch();
        
        this.resolvedData = true;
        this.detechChange.detectChanges();
      }));
  }
  
  handleEvent($event) {
    switch ($event['type']) {
      case "NEW_RECORD":
        return this.routerActions.go('cloud/default/license/create');
      
      case "CLICK_EDIT":
        return this.routerActions.go('cloud/default/license/edit', $event['data']);
      
      case "CLICK_DETAIL":
        return this.routerActions.go('cloud/default/license/detail', $event['data']);
      
      default:
    }
  }
}
