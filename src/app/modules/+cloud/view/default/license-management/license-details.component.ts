import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {RouterActions} from "../../../../../R/router/router.actions";
import {LicenseCollection} from "../../../../../services/meteor-collections/licenses";
import {PriceCollection} from "../../../../../services/meteor-collections/prices";
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {PlanCollection} from "../../../meteor-collections/plan";
import {NotifyManager} from "../../../../../services/notify-manager";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import * as _ from 'lodash';
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";

@Component({
               selector: 'license-details',
               templateUrl: 'license-details.component.html',
               changeDetection: ChangeDetectionStrategy.OnPush
           })
export class LicenseDetailsComponent extends AbstractSubscriptionComponent implements OnInit {
    licenseHasProduct: any;
    
    constructor(public licenseCollection: LicenseCollection,
                protected activatedRoute: ActivatedRoute,
                protected routerActions: RouterActions,
                protected planCollection: PlanCollection,
                protected pricingCollection: PriceCollection,
                protected productCollection: ProductCollection,
                protected notify: NotifyManager,
                protected elemenChangeDetector: ChangeDetectorRef) {
        super();
        
    }
    
    public licenseProduct: any[] = [];
    
    ngOnInit() {
        this.subscribeObservable("_", () =>
            Observable.combineLatest(
                this.activatedRoute.params,
                this.licenseCollection.getCollectionObservable(),
                this.planCollection.getCollectionObservable(),
                this.pricingCollection.getCollectionObservable(),
                this.productCollection.getCollectionObservable(),
            ).subscribe((z: any) => {
                const params                                             = z[0];
                const licenseCollection: MongoObservable.Collection<any> = z[1];
                const planCollection: MongoObservable.Collection<any>    = z[2];
                const pricingCollection: MongoObservable.Collection<any> = z[3];
                const productCollection: MongoObservable.Collection<any> = z[4];
                if (!!params['id']) {
                    const licenses = licenseCollection.collection.findOne({_id: params['id']});
                    if (!!licenses) {
                        if (_.isArray(licenses['has_product'])) {
                            this.licenseProduct = [];
                            _.forEach(licenses['has_product'], (p) => {
                                const plan    = planCollection.collection.find({"_id": p['plan_id']});
                                const pricing = pricingCollection.collection.findOne({"_id": p['pricing_id']});
                                const product = productCollection.collection.findOne({"_id": p['product_id']});
                                if (!!plan && !!pricing && !!product) {
                                    this.licenseProduct.push({
                                                                 productName: product['name'],
                                                                 pricingName: pricing['display_name'],
                                                                 shop_owner: licenses['shop_owner_username'],
                                                                 additionEntity: p['addition_entity'],
                                                                 billingCycle: parseInt(p['billing_cycle']),
                                                                 purchaseDate: p['purchase_date'],
                                                                 expiryDate: p['expiry_date'],
                                                                 productId: p['product_id'],
                                                                 status: licenses['status'],
                                                                 product_version: licenses['product_version']
                                                             });
                                } else {
                                    this.notify.error("Error", "can_not_find_plan_or_pricing");
                                }
                            });
                            this.elemenChangeDetector.detectChanges();
                        }
                        
                    } else {
                        this.showNonelicenseInform();
                        return;
                    }
                }
            })
        );
    }
    
    getLicensStatus(status) {
        if (isNaN(status)) {
            return "";
        } else {
            switch (parseInt(status)) {
                case 1:
                    return "Activated";
                case 0:
                    return "Deactivated";
                case 2:
                    return "Fresh";
                default:
                    return "";
            }
        }
    }
    
    getLicenseBillingCycleText(cycleId) {
        if (isNaN(cycleId)) {
            return "";
        } else {
            switch (parseInt(cycleId)) {
                case 0:
                    return "Lifetime";
                case 2:
                    return "Annually";
                case 1:
                    return "Monthly";
                default:
                    return "";
            }
        }
    }
    
    protected showNonelicenseInform() {
        $('#none-license-inform')['modal']();
    }
    
    viewEdit(productId) {
        this.routerActions.go('cloud/default/license/edit', {productId});
        
    }
    goBack() {
        this.routerActions.go('cloud/default/license/list');
    }
}
