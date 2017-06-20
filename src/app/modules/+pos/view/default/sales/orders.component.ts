import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {OrdersState} from "../../R/sales/orders/order.state";
import {PosConfigState} from "../../../R/config/config.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-orders',
             templateUrl: 'orders.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOrdersComponent implements OnInit {
  ordersState$: Observable<OrdersState>;
  configState$: Observable<PosConfigState>;
  
  constructor(private store$: Store<any>) {
    this.ordersState$ = this.store$.select('orders');
    this.configState$ = this.store$.select('config');
  }
  
  ngOnInit() { }
  
}
