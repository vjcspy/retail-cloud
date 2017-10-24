import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {LicenseCollection} from "../../../../../services/meteor-collections/licenses";
import {MongoObservable} from "meteor-rxjs";
import {RouterActions} from "../../../../../R/router/router.actions";
import {NotifyManager} from "../../../../../services/notify-manager";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";

@Component({
             // moduleId: module.id,
             selector: 'license-form',
             templateUrl: 'license-form.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class LicenseFormComponent extends AbstractSubscriptionComponent implements OnInit {
  public license  = {
    status: 1
  };
  public products = [];
  
  public data = {};
  
  constructor(protected route: ActivatedRoute,
              protected licenseCollection: LicenseCollection,
              protected notify: NotifyManager,
              protected changeDetectorRef: ChangeDetectorRef,
              protected routerActions: RouterActions) {
    super();
  }
  
  ngOnInit() {
    this.subscribeObservable("_", () => Observable.combineLatest(
      this.route.params,
      this.licenseCollection.getCollectionObservable()
    ).subscribe((z: any) => {
      const params                                             = z[0];
      const licenseCollection: MongoObservable.Collection<any> = z[1];
      
      if (!!params['id']) {
        const license = licenseCollection.findOne({_id: params['id']});
        
        if (!!license) {
          this.license = license;
          
          this.changeDetectorRef.detectChanges();
        } else {
          this.notify.error('can_not_find_license_with_id: ' + params['id']);
          this.goBack();
        }
      }
    }));
  }
  
  protected renderUserSelect2() {
  
  }
  
  public isEditingLicense(): boolean {
    if (!this.data.hasOwnProperty('isEditingLicense')) {
      this.data['isEditingLicense'] = !!this.license && !!this.license['_id'];
    }
    
    return this.data['isEditingLicense'];
  }
  
  goBack() {
    this.routerActions.go('cloud/default/license/list');
  }
}
