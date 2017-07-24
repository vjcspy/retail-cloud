import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CheckoutPopupState} from "../../../../../R/sales/checkout/popup/popup.state";
import {PosQuoteState} from "../../../../../../R/quote/quote.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-customer-detail-address',
             templateUrl: 'address.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupCustomerDetailAddressComponent implements OnInit {
  @Input() checkoutPopupState: CheckoutPopupState;
  @Input() quoteState: PosQuoteState;
  
  state = 'list';
  
  constructor() { }
  
  ngOnInit() { }
}
