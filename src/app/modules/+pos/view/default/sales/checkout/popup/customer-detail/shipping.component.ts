import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CheckoutPopupState} from "../../../../../R/sales/checkout/popup/popup.state";
import {PosQuoteState} from "../../../../../../R/quote/quote.state";
import {PosConfigState} from "../../../../../../R/config/config.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-customer-detail-shipping',
             templateUrl: 'shipping.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupCustomerDetailShippingComponent implements OnInit {
  @Input() checkoutPopupState: CheckoutPopupState;
  @Input() quoteState: PosQuoteState;
  @Input() posConfigState: PosConfigState;
  
  constructor() { }
  
  ngOnInit() { }
}
