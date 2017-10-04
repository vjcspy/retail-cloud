import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {OrdersState} from "../../../../R/sales/orders/order.state";
import {OrderService} from "../../../../R/sales/orders/order.service";
import {ListActions} from "../../../../R/sales/orders/list/list.actions";
import {PosConfigState} from "../../../../../R/config/config.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-orders-list-item',
             templateUrl: 'item.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOrdersListItemComponent implements OnInit {
  @Input() order: Object;
  @Input() ordersState: OrdersState;
  @Input() configState: PosConfigState;
  
  constructor(public orderService: OrderService, public listActions: ListActions) { }
  
  ngOnInit() { }
  
  isActive() {
    return this.order['retail_id'] && this.order['retail_id'] === this.ordersState.detail.order['retail_id'];
  }
  
  checkoutAsGuest(): boolean {
    if (this.order.hasOwnProperty('customer')) {
      return parseInt(this.order['customer']['id']) === parseInt(this.configState.setting.customer.getDefaultCustomerId());
    } else {
      return false;
    }
  }
}
