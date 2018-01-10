import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UserCollection} from "../../../../../../services/meteor-collections/users";
import * as _ from 'lodash';
import {RouterActions} from "../../../../../../R/router/router.actions";
import {LicenseCollection} from "../../../../../../services/meteor-collections/licenses";
import {AbstractSubscriptionComponent} from "../../../../../../code/AbstractSubscriptionComponent";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";

@Component({
             // moduleId: module.id,
             selector: 'cashier-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class CashierListComponent extends AbstractSubscriptionComponent implements OnInit {
  public license;
  public roles;
  
  constructor(public userCollection: UserCollection,
              protected licenseCollection: LicenseCollection,
              protected elemChangeDetechtor: ChangeDetectorRef,
              public routerActions: RouterActions) {
    super();
  }
  
  ngOnInit(): void {
    this.subscribeObservable('_', () =>
      Observable.combineLatest(
        this.licenseCollection.getCollectionObservable()
      ).subscribe((z: any) => {
        const licenseCollection: MongoObservable.Collection<any> = z[0];
        
        const licenses = licenseCollection.collection.find().fetch();
        
        if (_.size(licenses) === 1) {
          this.license = _.first(licenses);
          this.roles   = this.license['has_roles'] || [];
          
          this.elemChangeDetechtor.detectChanges();
        }
      }));
  }
  
  getTableConfig() {
    let vm = this;
    return {
      actionsColumn: {edit: true, remove: false},
      columns: [
        {data: "profile", title: "Name", searchable: true},
        {data: "username", title: "Username", searchable: true},
        {data: "emails", title: "Emails", searchable: true},
        {data: "has_license", title: "Roles"},
        {data: "has_license", title: "Status"},
      ],
      columnDefs: [
        {
          className: "first-name",
          targets: [0],
          render(data) {
            if (_.isObject(data)) {
              return (data['first_name'] || '') + ' ' + (data['last_name'] || '');
            } else {
              return "";
            }
          },
          izFilter: {
            name: "Name",
            type: 'text',
            filter: (filterComp) => {
              return {
                $or: [{'profile.first_name': new RegExp(filterComp['value'], 'gi')},
                  {'profile.last_name': new RegExp(filterComp['value'], 'gi')}]
              };
            }
          }
        },
        {
          className: "username",
          targets: [1],
          izFilter: {
            name: 'Username',
            type: 'text',
          }
        },
        {
          className: "email",
          orderable: false,
          targets: [2],
          render(data, type, row) {
            if (_.isArray(data)) {
              return data[0]['address'];
            } else {
              return "";
            }
          }
        },
        {
          className: "role",
          orderable: false,
          targets: [3],
          render(hasLicense, type, row) {
            if (_.size(hasLicense) === 1) {
              if (hasLicense[0]['license_permission'] === 'owner') {
                return 'OWNER';
              }
              
              const role = _.find(vm.roles, (r) => r['code'] === hasLicense[0]['shop_role']);
              return role ? role['name'] : 'NONE';
            } else {
              return "NONE";
            }
          }
        },
        {
          className: "status",
          targets: [4],
            render(hasLicense) {
                if (_.size(hasLicense) > 0) {
                    const license = _.first(hasLicense);
                    // return parseInt(license['status']) === 1 ? "Active" : "Deactive";
                    if (parseInt(license['status'])===1) {
                      return `<span class="label label-success">Activated</span>`;
                    } else if (parseInt(license['status'])===0) {
                      return `<span class="label label-danger">Deactivated</span>`;
                    }
                }else {
                    return "Deactive";
                }
            },
          izFilter: {
            name: 'Status',
            type: 'select',
            dataOptions: [
              {
                name: "Please select...",
                value: null
              },
              {
                name: 'Active',
                value: 1
              },
              {
                name: 'Deactive',
                value: 0
              }
            ],
            filter: (filterComp) => {
              if (parseInt(filterComp['value']) === 1) {
                return {status: 1};
              } else if (parseInt(filterComp['value'])=== 0) {
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
  
  handleTableEvent($event) {
    switch ($event['type']) {
      case "NEW_RECORD":
        return this.routerActions.go('cloud/default/user-management/cashier/create');
      
      case "CLICK_EDIT":
        return this.routerActions.go('cloud/default/user-management/cashier/edit', $event['data']);
      
      default:
    }
  }
}
