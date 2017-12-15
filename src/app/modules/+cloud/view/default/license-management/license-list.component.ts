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
  // $('.meteor-table-bt-edit').text("Detail");
  
  constructor(public licenseCollection: LicenseCollection,
              protected routerActions: RouterActions) { }
  
  public tableConfig = {
    actionsColumn: {edit: false, remove: true, detail: true},
    columns: [
      {data: "_id", title: "License ID"},
      {data: "key", title: "License Key"},
      {data: "shop_owner_username", title: "Shop owner"},
      {data: "has_product", title: "Products"},
      {data: "status", title: "Status"}
    ],
    columnDefs: [
      {className: "", orderable: false, targets: [0]},
      {className: "", orderable: false, targets: [1]},
        {
            targets: [2], render: data => data ? data : "",
        },
      {
        className: "", orderable: false,
        targets: [3],
        render: (data, type, row) => {
          let _html = "";
          let text="";
          if (_.isArray(data)) {
            _.forEach(data, product => {
              if (product['product_id']==="JcJcfodpL6KNrNR65") {
                  _html += `<span class="label label-warning">ConnectPOS</span>&nbsp;`;
              }
            });
          }
          return _html;
        }
      },
      {
        className: "text-center",
        orderable: false, targets: [4],
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
        return this.routerActions.go('cloud/default/license/edit', $event['data']);
      
      case "CLICK_DETAIL":
          return this.routerActions.go('cloud/default/license/detail', $event['data']);
         
      default:
    }
  }
}
