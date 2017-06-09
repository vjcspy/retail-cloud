import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {CartCustomerState} from "../../../R/sales/checkout/cart/customer.state";
import {PosConfigState} from "../../../../R/config/config.state";
import {CartItemState} from "../../../R/sales/checkout/cart/item.state";
import {CartTotalsState} from "../../../R/sales/checkout/cart/totals.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart',
             templateUrl: 'cart.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutCartComponent implements OnInit {
  @Input() quoteState: PosQuoteState;
  @Input() cartCustomerState: CartCustomerState;
  @Input() configState: PosConfigState;
  @Input() cartItemState: CartItemState;
  @Input() cartTotalsState: CartTotalsState;
  
  constructor() { }
  
  ngOnInit() {
  }
  
  protected onResizeCart() {
    console.log('not implement resize cart');
  }
}
