import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {OrdersState} from "../../R/sales/orders/order.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-orders',
             templateUrl: 'orders.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOrdersComponent implements OnInit {
  ordersState$: Observable<OrdersState>;
  
  constructor(private store$: Store<any>) {
    this.ordersState$ = this.store$.select('orders');
  }
  
  ngOnInit() { }
  
}
