import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {LicenseCollection} from "../../../../../services/meteor-collections/licenses";
import * as _ from 'lodash';
import {RouterActions} from "../../../../../R/router/router.actions";

@Component({
             // moduleId: module.id,
             selector: 'license-list',
             templateUrl: 'license-list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class LicenseListComponent implements OnInit {
  constructor(public licenseCollection: LicenseCollection,
              protected routerActions: RouterActions) { }
  
  public tableConfig = {
    actionsColumn: {edit: true, remove: true},
    columns: [
      {data: "key", title: "License Key"},
      {data: "has_product", title: "Products"},
      {data: "shop_owner_username", title: "Shop owner"},
      {data: "has_product", title: "Based Urls"},
      {data: "has_product", title: "Current User"},
      {data: "status", title: "Status"}
    ],
    columnDefs: [
      {className: "", orderable: false, targets: [0]},
      {
        className: "", orderable: false,
        targets: [1],
        render: (data, type, row) => {
          let _html = "";
          if (_.isArray(data)) {
            _.forEach(data, product => {
              _html += `<span class="label label-warning">${product['product_id']}</span>&nbsp;`;
            });
          }
          return _html;
        }
      },
      {
        targets: [2], render: data => data ? data : "",
      },
      {
        targets: [3],
        render: data => ``
      },
      {
        targets: [4],
        render: data => ``
      },
      {
        className: "text-center",
        orderable: false, targets: [5],
        render: data => {
          if (parseInt(data) === 1) {
            return `<span class="label label-success">Activated</span>`;
          } else if (parseInt(data) === 0) {
            return `<span class="label label-danger">Deactivated</span>`;
          } else if (parseInt(data) === 2) {
            return `<span class="label label-default">Fresh</span>`;
          }
        }
      }
    ],
    bFilter: true,
    sDom: 'ltp'
  };
  
  ngOnInit() { }
  
  handleEvent($event) {
    switch ($event['type']) {
      case "NEW_RECORD":
        return this.routerActions.go('cloud/default/license/create');
      
      case "CLICK_EDIT":
        return this.routerActions.go('cloud/default/user-management/cashier/edit', $event['data']);
      
      default:
    }
  }
}
