import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import * as _ from 'lodash';
import {QuoteRefundActions} from "../../../../../R/quote/refund/refund.actions";
import {PosConfigState} from "../../../../../R/config/config.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-refund-items',
             templateUrl: 'refund-items.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class PosDefaultSalesCheckoutCartRefundItemsComponent implements OnInit {
  @Input() posQuoteState: PosQuoteState;
  @Input() configState: PosConfigState;
  protected data = {};
  
  constructor(private refundActions: QuoteRefundActions) { }
  
  ngOnInit() { }
  
  activeRefundItem($event, item) {
    if ($event.target.className.indexOf("count-num") > -1) {
      return;
    }
    if ($event.target.className.indexOf("return_stock") > -1) {
      return;
    }
    
    let needReload: boolean = false;
    if (item['qty'] > 0) {
      item['qty'] = 0;
      needReload  = true;
    } else if (parseInt(item['qty']) === 0 && item['qty_to_refund'] > 0) {
      item['qty'] = item['qty_to_refund'];
      needReload  = true;
    }
    
    if (needReload) {
      this.refundActions.loadCreditmemo(this.posQuoteState.creditmemo['order_id']);
    }
  }
  
  getChildrenBundle(item) {
    if (!this.data.hasOwnProperty('children')) {
      this.data['children'] = [];
      
      _.forEach(this.posQuoteState.creditmemo['items'], (_item) => {
        if (parseInt(_item['parent_id']) === parseInt(item['item_id'])) {
          this.data['children'].push(_item);
        }
      });
    }
    return this.data['children'];
  }
}
