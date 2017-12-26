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
      {data: "display_name", title: "Display Name"},
      {data: "type", title: "Type"},
      {data: "cost_monthly", title: "Cost Monthly"},
      {data: "cost_annually", title: "Cost Yearly"},
    
    ],
    columnDefs: [
      {
        className: "text-center",
        orderable: false,
        targets: [0, 1, 2, 3],
        render(data) {
          if (data) {
            return data;
          } else {
            return `-`;
          }
        }
      },
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
