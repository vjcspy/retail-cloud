import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {CartTotalsState} from "../../../../R/sales/checkout/cart/totals.state";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosConfigState} from "../../../../../R/config/config.state";
import {NumberHelper} from "../../../../../services/helper/number-helper";
import {CartTotalsActions} from "../../../../R/sales/checkout/cart/totals.actions";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {PosSyncActions} from "../../../../../R/sync/sync.actions";
import {QuoteRefundActions} from "../../../../../R/quote/refund/refund.actions";
import {AuthenticateService} from "../../../../../../../services/authenticate";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-totals',
             templateUrl: 'totals.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutCartTotalsComponent implements OnInit {
  @Input() quoteState: PosQuoteState;
  @Input() configState: PosConfigState;
  @Input() cartTotalsState: CartTotalsState;
  
  constructor(protected cartTotalsActions: CartTotalsActions,
              private notify: NotifyManager,
              private syncActions: PosSyncActions,
              protected authService: AuthenticateService,
              private refundActions: QuoteRefundActions) { }
  
  ngOnInit() { }
  
  protected getAppliedTaxes() {
    let appliedTaxes = this.quoteState.quote.getShippingAddress().getData('applied_taxes');
    let _result      = [];
    if (appliedTaxes) {
      _.forEach(appliedTaxes, (tax) => {
        _result.push({id: tax['id'], percent: NumberHelper.round(tax['percent'], 4), amount: tax['amount']});
      });
    }
    return _result;
  }
  
  updateOrderDiscount(type: string, $event: any) {
    let value = $event.target['value'];
    if (type === 'discount_whole_order') {
      this.quoteState
          .quote
          .setData('discount_whole_order', value)
          .setData('is_value_discount_whole_order', this.cartTotalsState.isDiscountWholeOrderValue);
    } else if (type === 'coupon_code') {
      this.quoteState.quote.setData('coupon_code', value);
    }
    
    this.syncOrder();
  }
  
  removeOrderDiscount() {
    this.cartTotalsActions.changeDiscountPopupState(false);
    this.quoteState
        .quote
        .unsetData('discount_whole_order')
        .unsetData('coupon_code');
    
    this.syncOrder(true);
  }
  
  syncOrder(isRemove = false) {
    if (this.quoteState.items.count() > 0) {
      
      // validate discount whole order
      const discountWholeOrder = this.quoteState.quote.getData('discount_whole_order');
      const couponCode         = this.quoteState.quote.getData('coupon_code');
      
      if (!isRemove && (isNaN(discountWholeOrder) || parseFloat(discountWholeOrder) < 0)) {
        this.notify.warning("check_discount_whole_order");
        
        return;
      }
      
      if (!isRemove && ((discountWholeOrder === '' || discountWholeOrder === null) && !couponCode)) {
        return;
      }
      
      if (!this.cartTotalsState.isDiscountWholeOrderValue) {
        if (discountWholeOrder > 100) {
          this.quoteState
              .quote
              .setData('discount_whole_order', 100);
        }
      }
      
      this.syncActions.syncCurrentOrder(false);
    } else {
      this.notify.warning("no_item_in_cart");
    }
  }
  
  reloadCreditmemo() {
    this.refundActions.loadCreditmemo(this.quoteState.creditmemo['order_id']);
  }
  
  changeDiscountType(isDiscountValue: boolean = true) {
    this.quoteState.quote.setData('is_value_discount_whole_order',isDiscountValue);
    this.cartTotalsActions.changeDiscountType(isDiscountValue);
  }
}
