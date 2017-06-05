import {Component, Input, OnInit} from '@angular/core';
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {CheckoutState} from "../../../R/sales/checkout.state";
import {PosConfigState} from "../../../../R/config/config.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart',
             templateUrl: 'cart.component.html'
           })
export class PosDefaultSalesCheckoutCartComponent implements OnInit {
  @Input() quoteState: PosQuoteState;
  @Input() checkoutState: CheckoutState;
  @Input() configState: PosConfigState;
  
  constructor() { }
  
  ngOnInit() {
  }
  
  protected onResizeCart() {
    console.log('not implement resize cart');
  }
}
