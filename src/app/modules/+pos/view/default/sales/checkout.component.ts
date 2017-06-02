import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {PosPullActions} from "../../../R/entities/pull.actions";
import {CheckoutState} from "../../R/sales/checkout.state";
import {Observable} from "rxjs";
import {PosEntitiesState} from "../../../R/entities/entities.state";
import {PosConfigState} from "../../../R/config/config.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout',
             templateUrl: 'checkout.component.html'
           })
export class PosDefaultSalesCheckoutComponent implements OnInit {
  protected checkoutState$: Observable<CheckoutState>;
  protected entitiesState$: Observable<PosEntitiesState>;
  protected configState$: Observable<PosConfigState>;
  
  constructor(private store$: Store<any>, private pullActions: PosPullActions) {
    this.checkoutState$ = this.store$.select('checkout');
    this.entitiesState$ = this.store$.select('entities');
    this.configState$   = this.store$.select('config');
  }
  
  ngOnInit() {
    this.pullActions.pullEntities([
                                    'retailConfig',
                                    'settings',
                                    'stores',
                                    'outlet',
                                    // 'warehouse',
                                    // 'permission',
                                    'customerGroup',
                                    'countries',
                                    'taxClass',
                                    'taxes',
                                    // 'orders',
                                    'shifts',
                                    'receipts',
                                    'payment',
                                    'userOrderCount',
                                    // 'category',
                                    'customers',
                                    'products'
                                  ]);
  }
  
}
