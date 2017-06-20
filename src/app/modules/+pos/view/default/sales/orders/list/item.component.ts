import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ListService} from "../../../../R/sales/orders/list/list.service";
import {OrdersState} from "../../../../R/sales/orders/order.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-orders-list-item',
             templateUrl: 'item.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOrdersListItemComponent implements OnInit {
  @Input() order: Object;
  @Input() ordersState: OrdersState;
  
  constructor(public listService: ListService) { }
  
  ngOnInit() { }
  
  isActive() {
    return this.order['id'] && this.order['id'] === this.ordersState.detail.order['id'];
  }
}
