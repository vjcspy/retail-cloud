import {ChangeDetectionStrategy, Component} from '@angular/core';
import {UserCollection} from "../../../../../../services/meteor-collections/users";
import * as _ from 'lodash';

@Component({
             // moduleId: module.id,
             selector: 'cashier-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class CashierListComponent {
  constructor(public userCollection: UserCollection) { }
  
  getTableConfig() {
    return {
      actionsColumn: {edit: true, remove: true},
      columns: [
        {data: "profile", title: "Name", searchable: true},
        {data: "username", title: "Username", searchable: true},
        {data: "emails", title: "Emails", searchable: true},
        {data: "roles", title: "Roles"},
        {data: "profile", title: "Status"},
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
          render(roles, type, row) {
            if (_.isObject(roles) && roles.hasOwnProperty("cloud_group")) {
              return roles['cloud_group'];
            } else {
              return "";
            }
          }
        },
        {
          className: "status",
          targets: [4],
          render(data) {
            if (!!data && ((data.hasOwnProperty('status') && parseInt(data['status']) === 1) || (data.hasOwnProperty('is_disabled') && parseInt(data['is_disabled']) === 0))) {
              return `Enabled`;
            } else {
              return `Disabled`;
            }
          }
        }
      ],
      bFilter: true,
      sDom: 'ltp'
    };
  }
  
  handleTableEvent($event) {
    console.log($event);
  }
  
}
