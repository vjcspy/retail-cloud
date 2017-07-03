import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CartActionBarState} from "../../../../R/sales/checkout/cart/action-bar.state";
import {CartActionBarActions} from "../../../../R/sales/checkout/cart/action-bar.actions";
import {CartActionBarService} from "../../../../R/sales/checkout/cart/action-bar.service";
import * as _ from 'lodash';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-actions-bar-order-onhold',
             templateUrl: 'order-onhold.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutActionsBarOrderOnholdComponent implements OnInit {
  @Input() cartActionBarState: CartActionBarState;
  
  constructor(protected cartActionBarActions: CartActionBarActions,
              protected cartActionBarService: CartActionBarService) { }
  
  ngOnInit() { }
  
  getTotalItem(order) {
    let totalQty = 0;
    if (order.hasOwnProperty('items')) {
      _.forEach(order['items'], item => {
        totalQty += parseFloat(item['qty_ordered']);
      });
    }
    return totalQty;
  }
}
