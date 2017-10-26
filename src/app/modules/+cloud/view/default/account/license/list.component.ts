import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {RouterActions} from "../../../../../../R/router/router.actions";
import {LicenseCollection} from "../../../../../../services/meteor-collections/licenses";
import {AbstractSubscriptionComponent} from "../../../../../../code/AbstractSubscriptionComponent";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";

@Component({
             // moduleId: module.id,
             selector: 'account-license-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountLicenseListComponent extends AbstractSubscriptionComponent implements OnInit {
  constructor(public routerActions: RouterActions,
              protected licenseCollection: LicenseCollection) {
    super();
  }
  
  ngOnInit() {
    this.subscribeObservable("_", () =>
      Observable
        .combineLatest(
          this.licenseCollection.getCollectionObservable()
        ).subscribe((z: any) => {
        const licenseCollection: MongoObservable.Collection<any> = z[0];
        
        const license = licenseCollection.collection.findOne();
        
        if (license) {
        
        } else {
          this.showNonelicenseInform();
          return;
        }
      }));
  }
  
  protected showNonelicenseInform() {
    $('#none-license-inform')['modal']();
  }
  
  goProductsPage() {
    this.routerActions.go('cloud/default/c-product/list');
    $('#none-license-inform')['modal']('hide');
  }
}
