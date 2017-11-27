import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ShopManageService} from "../../../../R/shop/service";
import {ActivatedRoute} from "@angular/router";
import {ShopManageActions} from "../../../../R/shop/actions";
import {AbstractSubscriptionComponent} from "../../../../../../code/AbstractSubscriptionComponent";
import {Observable} from "rxjs/Observable";
import {LicenseCollection} from "../../../../../../services/meteor-collections/licenses";
import {MongoObservable} from "meteor-rxjs";
import * as _ from 'lodash';
import {GeneralException} from "../../../../../../code/GeneralException";
import {RouterActions} from "../../../../../../R/router/router.actions";

@Component({
             // moduleId: module.id,
             selector: 'permission-component',
             templateUrl: 'permission.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class PermissionComponent extends AbstractSubscriptionComponent implements OnInit {
  constructor(protected shopManageService: ShopManageService,
              protected shopManageActions: ShopManageActions,
              protected licenseCollection: LicenseCollection,
              protected route: ActivatedRoute,
              protected changeDetectorRef: ChangeDetectorRef,
              protected routerActions: RouterActions) {
    super();
  }
  
  permissions: any[];
  code: string;
  
  data = {
    activatedGroup: ''
  };
  
  ngOnInit() {
    this.subscribeObservable('_', () =>
      Observable.combineLatest(
        this.route.params,
        this.licenseCollection.getCollectionObservable(),
        Observable.fromPromise(this.shopManageService.getPermissions())
      ).subscribe((z: any) => {
        this.code = z[0]['code'];
        
        if (!!this.code) {
          const licenseCollection: MongoObservable.Collection<any> = z[1];
          this.permissions                                         = z[2];
          
          if (!this.data.activatedGroup) {
            this.data.activatedGroup = _.first(this.permissions)['group'];
          }
          
          const licenses = licenseCollection.collection.find().fetch();
          
          this.changeDetectorRef.detectChanges();
        } else {
          throw new GeneralException("can_not_find_role_code");
        }
      }));
  }
  
  save() {
    
  }
}
