import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LicenseCollection} from "../../../../../services/meteor-collections/licenses";
import * as _ from 'lodash';
import {RouterActions} from "../../../../../R/router/router.actions";
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import {NotifyManager} from "../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'license-list',
             templateUrl: 'license-list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class LicenseListComponent extends AbstractSubscriptionComponent implements OnInit {
  resolvedData: boolean = false;
  protected products;
  protected license;
  public licenseProduct: any[] = [];
  public tableConfig = {};
  
  constructor(public licenseCollection: LicenseCollection,
              protected productCollection: ProductCollection,
              protected detechChange: ChangeDetectorRef,
              protected routerActions: RouterActions,
              protected notify: NotifyManager,
  ) {
    super();
  }
  
  public initTable() {
      this.tableConfig = {
          actionsColumn: {edit: true, detail: true},
          columns: [
              {data: "_id", title: "License ID"},
              {data: "key", title: "License Key", searchable: true},
              {data: "shop_owner_username", title: "Shop owner", searchable: true},
              {data: "has_product", title: "Products", searchable: true},
              {data: "status", title: "Status"}
          ],
          columnDefs: [
              {className: "", orderable: false, targets: [0]},
              {
                  className: "", orderable: false, targets: [1],
                  izFilter: {
                      name: "License Key",
                      type: 'text',
                      filter: (filterComp) => {
                          return {
                              'key': new RegExp(filterComp['value'], 'gi')
                          };
                      }
                  }
              },
              {
                  targets: [2], render: data => data ? data : "",
                  izFilter: {
                      name: "Shop Owner",
                      type: 'text',
                      filter: (filterComp) => {
                          return {
                              'shop_owner_username': new RegExp(filterComp['value'], 'gi')
                          };
                      }
                  }
                
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
                  },
                  izFilter: {
                      name: "Product",
                      type: 'select',
                      dataOptions: this.licenseProduct,
                      filter: (filterComp) => {
                          // filterComp: {data: column, value: // gia tri filter hien tai}
                          if (parseInt(filterComp['value']) !== 0) {
                              return {'has_product': {$elemMatch: {product_id: filterComp['value']}}};
                          }
                      }
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
                        
                      }
                  },
                  izFilter: {
                      name: 'Status',
                      type: 'select',
                      dataOptions: [
                          {
                              name: "Please select...",
                          },
                          {
                              name: 'Active',
                              value: 1
                          },
                          {
                              name: 'Deactive',
                              value: 0
                          },
                      ],
                      filter: (filterComp) => {
                          if (parseInt(filterComp['value']) === 1) {
                              return {status: 1};
                          } else if (parseInt(filterComp['value']) === 0) {
                              return {status: 0};
                          }
                      }
                  }
              }
          ],
          bFilter: true,
          sDom: 'ltp'
      };
  }
  
  ngOnInit() {
    this.subscribeObservable("_", () =>
      Observable.combineLatest(
        this.productCollection.getCollectionObservable(),
        this.licenseCollection.getCollectionObservable()
      ).subscribe((z: any) => {
        const productCollection: MongoObservable.Collection<any> = z[0];
        const licenseCollection: MongoObservable.Collection<any> = z[1];
        this.products                                            = productCollection.collection.find().fetch();
        const  license = licenseCollection.collection.findOne();
        if (license) {
            if (_.isArray(license['has_product'])) {
                this.licenseProduct = [];
                this.licenseProduct.push({
                                             name : "Please select...",
                                             value: 0
                                         });
                _.forEach(license['has_product'], (p) => {
                   const product = productCollection.collection.findOne({"_id": p['product_id']});
                   if (!!product) {
                       this.licenseProduct.push({
                           name : product['name'],
                           value: p['product_id']
                                                });
                   } else {
                       this.notify.error("Error", "can_not_find_product");
                   }
                });
            }
        }
        this.resolvedData = true;
        this.initTable();
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
