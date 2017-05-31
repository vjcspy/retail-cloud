import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {PosPullActions} from "../../../R/entities/pull.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout',
             templateUrl: 'checkout.component.html'
           })
export class PosDefaultSalesCheckoutComponent implements OnInit {
  constructor(private store: Store<any>, private pullActions: PosPullActions) { }
  
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
