import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {PriceCollection} from "../../../../../services/meteor-collections/prices";
import {RouterActions} from "../../../../../R/router/router.actions";

@Component({
             // moduleId: module.id,
             selector: 'pricing-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class PricingListComponent implements OnInit {
  public tableConfig = {
    actionsColumn: {edit: true, remove: false},
    columns: [
      {data: "name", title: "Pricing Name"},
      {data: "display_name", title: "Display Name"},
      {data: "type", title: "Type"},
      {data: "cost_monthly", title: "Cost Monthly"},
      {data: "cost_annually", title: "Cost Yearly"},
      {data: "cost_adding", title: "Cost of adding new active user"},
      {data: "visibility", title: "Visibility"},
    
    ],
    columnDefs: [
      {className: "hidden-xs", targets: [0]},
      {
        className: "text-center",
        orderable: false,
        targets: [2],
        render(data) {
          return data;
        }
      },
      {
        className: "text-center",
        orderable: false,
        targets: [3,4, 5],
        render(data) {
          if (!!data) {
            return data;
          }
          return ``;
        }
      },
      {
        className: "text-center",
        orderable: false, targets: [6],
        render(data) {
          if (data === 0) {
            return `<span class="label label-success">Hidden</span>`;
          } else if (data === 1) {
            return `<span class="label label-danger">Show to customer</span>`;
          }
        }
      }
    ],
    bFilter: true,
    sDom: 'ltp'
  };
  
  constructor(public pricingCollection: PriceCollection,
              protected routerActions: RouterActions) { }
  
  ngOnInit() { }
  
  handleEvent($event) {
    switch ($event['type']) {
      case "NEW_RECORD":
        return this.routerActions.go('cloud/default/pricing/create');
      
      case "CLICK_EDIT":
        return this.routerActions.go('cloud/default/pricing/edit', $event['data']);
      
      default:
    }
  }
}
