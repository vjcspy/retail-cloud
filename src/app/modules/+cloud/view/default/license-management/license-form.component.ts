import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {LicenseCollection} from "../../../../../services/meteor-collections/licenses";
import {MongoObservable} from "meteor-rxjs";
import {RouterActions} from "../../../../../R/router/router.actions";
import {NotifyManager} from "../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'license-form',
             templateUrl: 'license-form.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class LicenseFormComponent implements OnInit {
  public license;
  
  constructor(protected route: ActivatedRoute,
              protected licenseCollection: LicenseCollection,
              protected notify: NotifyManager,
              protected changeDetectorRef: ChangeDetectorRef,
              protected routerActions: RouterActions) { }
  
  ngOnInit() {
    Observable.combineLatest(
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
    });
  }
  
  protected renderUserSelect2() {
  
  }
  
  goBack() {
    this.routerActions.go('cloud/default/license/list');
  }
}
