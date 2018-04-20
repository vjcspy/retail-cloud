import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import {QuoteRefundActions} from "../../../../../../R/quote/refund/refund.actions";
import {PosQuoteState} from "../../../../../../R/quote/quote.state";
import {PosConfigState} from "../../../../../../R/config/config.state";
import * as _ from 'lodash';
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-refund-items-item',
             templateUrl: 'item.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class PosDefaultSalesCheckoutCartRefundItemsItemComponent {
  @Input() posQuoteState: PosQuoteState;
  @Input() configState: PosConfigState;
  @Input() entitiesState: PosEntitiesState;
  @Input() item;

  protected data = {
    images: {}
  };

  constructor(private refundActions: QuoteRefundActions) { }

  activeRefundItem($event, item) {
    if ($event.target.className.indexOf("count-num") > -1) {
      return;
    }
    if ($event.target.className.indexOf("return_stock") > -1) {
      return;
    }
    if (item['qty'] > 0) {
      item['qty'] = 0;
      item['row_total_incl_tax'] = 0;
    } else if (parseInt(item['qty']) === 0 && item['qty_to_refund'] > 0) {
      item['qty'] = item['qty_to_refund'];
    }

    this.reloadCreditmemo();
  }

  reloadCreditmemo() {
    this.refundActions.loadCreditmemo(this.posQuoteState.creditmemo['order_id']);
  }

  reloadCreditmemoQtyZero(childItem) {
    if (childItem['qty'] == 0) {
      _.forEach(this.posQuoteState.creditmemo['items'], (_item, key) => {
        if (parseInt(_item['item_id']) === parseInt(childItem['parent_id'])) {
          let grandTotal = this.posQuoteState['grandTotal'] + parseInt(childItem['row_total']);
          childItem['tmp_row_total'] = childItem['row_total'];
          childItem['tmp_grandTotal'] = grandTotal;
          childItem['row_total'] = 0;
          childItem['row_total_incl_tax'] = 0;
          childItem['qty'] = 0;

          this.refundActions.loadCreditmemoQtyZero(childItem);
        }
      });
    } else {
      this.reloadCreditmemo();
    }
  }

  getItemImage(item) {
    const productId = item['product_id'];
    if (!this.data.images.hasOwnProperty(productId)) {
      let product                 = this.entitiesState.products.items.find((p) => parseInt(p['id']) === parseInt(productId));
      this.data.images[productId] = product && !!product['origin_image'] ? product['origin_image'] : 'assets/img/no-image.jpg';
    }
    return this.data.images[productId];
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
