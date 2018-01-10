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
import {NotifyManager} from "../../../../../../services/notify-manager";
import {Store} from "@ngrx/store";
import {ShopManageState} from "../../../../R/shop/state";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
             // moduleId: module.id,
             selector: 'permission-component',
             templateUrl: 'permission.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class PermissionComponent extends AbstractSubscriptionComponent implements OnInit {
  shopManageState$: Observable<ShopManageState>;
  
  constructor(protected shopManageService: ShopManageService,
              protected shopManageActions: ShopManageActions,
              protected licenseCollection: LicenseCollection,
              protected route: ActivatedRoute,
              protected notify: NotifyManager,
              protected changeDetectorRef: ChangeDetectorRef,
              protected store$: Store<any>,
              protected routerActions: RouterActions) {
    super();
    this.shopManageState$ = this.store$.select('shopManage');
  }
  
  permissions: any[];
  code: string;
  role: any;
  
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
          
          const licenses = licenseCollection.collection.find().fetch();
          if (_.size(licenses) === 1) {
            const roles = licenses[0]['has_roles'];
            this.role   = _.find(roles, (r) => r['code'] === this.code);
            if (!!this.role) {
              
              // resolve default value of permission
              if (_.isArray(z[2])) {
                this.permissions = _.map(z[2], (group) => {
                  group['sections'] = _.map(group['sections'], (section) => {
                    section['permissions'] = _.map(section['permissions'], (permission) => {
                      if (this.role && _.isArray(this.role['has_permissions'])) {
                        const _p = _.find(this.role['has_permissions'], (p) => p['permission'] === permission['permission']);
                        if (_p) {
                          permission['is_active'] = _p['is_active'];
                        }
                      } else {
                        permission['is_active'] = false;
                      }
                      
                      return permission;
                    });
                    
                    return section;
                  });
                  
                  return group;
                });
                
                if (!this.data.activatedGroup) {
                  this.data.activatedGroup = _.first(this.permissions)['group'];
                }
                
                this.changeDetectorRef.detectChanges();
              }
            }
          }
        } else {
          throw new GeneralException("can_not_find_role_code");
        }
      }));
  }
  
  checkHidden(sec, per) {
      if (sec['name'] === 'Reports') {
          if (sec['permissions'][0]['is_active'] === false && per['permission'] !== 'access_to_xreport') {
              return true;
          }
      }
  }
  
  save() {
    if (!!this.role['code']) {
        const reportGroup = _.find(this.permissions, (grp) => {
            return grp.group === 'report';
        });
        const reportSection = _.find(reportGroup['sections'], (sec) => {
            return sec['name'] === 'Reports';
        });
        _.forEach(reportSection['permissions'], (per) => {
          if (reportSection['permissions'][0]['is_active'] === false && per['permission'] !== 'access_to_xreport') {
            per['is_active'] = false;
          }
        });
        this.shopManageActions.savePermission(this.permissions, this.role['code']);
    } else {
      this.notify.error("can_not_find_role");
    }
  }
  
}
