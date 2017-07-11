import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {salesReducer, SalesState} from "../R/index";
import {PosStepState} from "../R/sales/checkout/step/step.state";
import {Bootstrap} from "../../core/framework/bootstrap";
import {Observable} from "rxjs";
import {MenuState} from "../R/sales/menu/menu.state";
import {AbstractSubscriptionComponent} from "../../../../code/AbstractSubscriptionComponent";
import {PosConfigState} from "../../R/config/config.state";
import {ReceiptState} from "../R/sales/receipts/receipt.state";
import {AccountState} from "../../../../R/account/account.state";
import {OrderService} from "../R/sales/orders/order.service";
import {PosGeneralState} from "../../R/general/general.state";
import {ReducerManagement} from "../../../../services/reducer-management";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales',
             templateUrl: 'sales.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesPage extends AbstractSubscriptionComponent implements OnInit {
  posStepState$: Observable<PosStepState>;
  menuState$: Observable<MenuState>;
  configState$: Observable<PosConfigState>;
  receiptState$: Observable<ReceiptState>;
  accountState$: Observable<AccountState>;
  generalState$: Observable<PosGeneralState>;
  
  constructor(protected store$: Store<SalesState>, public orderListViewService: OrderService, private reducerManagement: ReducerManagement) {
    super();
    this.reducerManagement.replaceReducer('salesReducer', salesReducer());
    this.posStepState$ = this.store$.select('step');
    this.menuState$    = this.store$.select('menu');
    this.configState$  = this.store$.select('config');
    this.receiptState$ = this.store$.select('receipt');
    this.accountState$ = this.store$.select('account');
    this.generalState$ = this.store$.select('general');
  }
  
  ngOnInit(): void {
    Bootstrap.run();
  }
}
