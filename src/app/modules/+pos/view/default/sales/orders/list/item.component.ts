import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {OrdersState} from "../../../../R/sales/orders/order.state";
import {OrderService} from "../../../../R/sales/orders/order.service";
import {ListActions} from "../../../../R/sales/orders/list/list.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-orders-list-item',
             templateUrl: 'item.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOrdersListItemComponent implements OnInit {
  @Input() order: Object;
  @Input() ordersState: OrdersState;
  
  constructor(public orderService: OrderService, public listActions: ListActions) { }
  
  ngOnInit() { }
  
  isActive() {
    return this.order['id'] && this.order['id'] === this.ordersState.detail.order['id'];
  }
}
