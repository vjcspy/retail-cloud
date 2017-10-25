import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {LicenseCollection} from "../../../../../services/meteor-collections/licenses";
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import {Store} from "@ngrx/store";
import {AccountState} from "../../../../../R/account/account.state";
import {NotifyManager} from "../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'product-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class CProductListComponent extends AbstractSubscriptionComponent implements OnInit {
  public accountState$: Observable<AccountState>;
  public license;
  public products;
  
  constructor(protected licenseCollection: LicenseCollection,
              protected productCollection: ProductCollection,
              protected store$: Store<any>,
              protected notify: NotifyManager) {
    super();
    this.accountState$ = this.store$.select('account');
  }
  
  ngOnInit() {
    this.subscribeObservable("_", () =>
      Observable.combineLatest(
        this.productCollection.getCollectionObservable(),
        this.licenseCollection.getCollectionObservable(),
        this.accountState$
      ).subscribe((z: any) => {
        const productCollection: MongoObservable.Collection<any> = z[0];
        const licenseCollection: MongoObservable.Collection<any> = z[1];
        const accountState: AccountState                         = z[2];
        
        this.license  = licenseCollection.collection.findOne();
        this.products = productCollection.find().fetch();
        
        if (this.license) {
          // User has already bought product
          if (accountState.user['_id'] !== this.license['shop_owner_id']) {
            this.notify.error("you_are_not_shop_owner");
            
            return;
          }
        } else {
        
        }
      })
    );
  }
}
