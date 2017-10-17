import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {RouterActions} from "../../../../../R/router/router.actions";
import * as _ from 'lodash';

@Component({
             // moduleId: module.id,
             selector: 'product-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class ProductListComponent implements OnInit {
  constructor(public productsCollection: ProductCollection, protected routerActions: RouterActions) { }
  
  public tableConfig = {
    actionsColumn: {edit: true},
    columns: [
      {data: "code", title: "Code"},
      {data: "name", title: "Name"},
      {data: "versions", title: "Versions"},
    ],
    columnDefs: [
      {className: "hidden-xs", targets: [1]},
      {
        className: "text-center",
        orderable: false,
        render(data, type, row) {
          let _html = "";
          if (_.isObject(data)) {
            _.forEach(data, version => {
              _html += `<span class="label label-info">${version['version']}</span>&nbsp;`;
            });
          }
          return _html;
        },
        targets: [2],
      },
    ],
    bFilter: true,
    sDom: 'ltp'
  };
  
  ngOnInit() { }
  
  handleEvent($event) {
    switch ($event['type']) {
      case "NEW_RECORD":
        return this.routerActions.go('cloud/default/product/create');
      
      case "CLICK_EDIT":
        return this.routerActions.go('cloud/default/product/edit', $event['data']);
      
      default:
    }
  }
}
