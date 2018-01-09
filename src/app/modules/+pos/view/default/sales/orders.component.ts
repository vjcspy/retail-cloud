import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {PosConfigState} from "../../../R/config/config.state";
import {PosQuoteState} from "../../../R/quote/quote.state";
import {OrdersState} from "../../R/sales/orders/order.state";
import {PosGeneralState} from "../../../R/general/general.state";
import {PosSyncState} from "../../../R/sync/sync.state";
import {PosStepState} from "../../R/sales/checkout/step/step.state";
import {ReceiptState} from "../../R/sales/receipts/receipt.state";
import {PosEntitiesState} from "../../../R/entities/entities.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-orders',
             templateUrl: 'orders.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOrdersComponent implements OnInit {
  ordersState$: Observable<OrdersState>;
  configState$: Observable<PosConfigState>;
  quoteState$: Observable<PosQuoteState>;
  generalState$: Observable<PosGeneralState>;
  posSyncState$: Observable<PosSyncState>;
  storeState$: Observable<PosEntitiesState>;
  
  posStepState$: Observable<PosStepState>;
  receiptState$: Observable<ReceiptState>;
  
  constructor(private store$: Store<any>) {
    this.ordersState$  = this.store$.select('orders');
    this.configState$  = this.store$.select('config');
    this.configState$  = this.store$.select('config');
    this.quoteState$   = this.store$.select('quote');
    this.generalState$ = this.store$.select('general');
    this.posSyncState$ = this.store$.select('sync');
    this.posStepState$ = this.store$.select('step');
    this.receiptState$ = this.store$.select('receipt');
    this.storeState$   = this.store$.select('entities');
  }
  
  ngOnInit() { }
  
}
