import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {RouterActions} from "../../../../../R/router/router.actions";
import * as _ from 'lodash';
import {ProductActions} from "../../../R/product/actions";
import {LicenseCollection} from "../../../../../services/meteor-collections/licenses";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";

@Component({
               // moduleId: module.id,
               selector: 'product-list',
               templateUrl: 'list.component.html',
               changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class ProductListComponent extends AbstractSubscriptionComponent implements OnInit {
    resolvedData: boolean = false;
    protected licenses;
    public tableConfig    = {};
    
    constructor(public productsCollection: ProductCollection,
                protected licensesCollection: LicenseCollection,
                protected detechChange: ChangeDetectorRef,
                protected routerActions: RouterActions,
                protected productActions: ProductActions) {
        super();
    }
    
    public initTable() {
        
        this.tableConfig = {
            actionsColumn: {edit: true, remove: true},
            columns: [
                {data: "code", title: "Code"},
                {data: "name", title: "Name"},
                {data: "versions", title: "Versions"},
                {data: "_id", title: "Number of active licenses"},
            ],
            columnDefs: [
                {className: "hidden-xs", targets: [1]},
                {
                    className: "text-center",
                    orderable: false,
                    render(data, type, row) {
                        let _html = "";
                        if (_.isObject(data)) {
                            _.forEach(data, version => {
                                _html += `<span class="label label-info">${version['version']}</span>&nbsp;`;
                            });
                        }
                        return _html;
                    },
                    targets: [2],
                },
                {
                    className: "text-center",
                    orderable: false,
                    render: (data, type, row) => {
                        const licensesActive = _.reduce(this.licenses, (result, license) => {
                            return result += _.find(license['has_product'], (product) => product['product_id'] === data) ? 1 : 0;
                        }, 0);
                        console.log(licensesActive);
                        return licensesActive;
                    },
                    targets: [3],
                },
            ],
            bFilter: true,
            sDom: 'ltp'
        };
    }
    
    ngOnInit() {
        
        this.subscribeObservable("_", () =>
            Observable.combineLatest(
                this.productsCollection.getCollectionObservable(),
                this.licensesCollection.getCollectionObservable()
            ).subscribe((z: any) => {
                const licensesCollection: MongoObservable.Collection<any> = z[1];
                this.licenses                                             = licensesCollection.collection.find().fetch();
                this.resolvedData                                         = true;
                this.initTable();
                this.detechChange.detectChanges();
            }));
        
        console.log(this.licenses);
    }
    
    handleEvent($event) {
        switch ($event['type']) {
            case "NEW_RECORD":
                return this.routerActions.go('cloud/default/product/create');
            
            case "CLICK_EDIT":
                return this.routerActions.go('cloud/default/product/edit', $event['data']);
            
            case "APPROVE_REMOVE_RECORD":
                this.productActions.removeProduct($event['data']);
                return;
            
            default:
        }
    }
}
