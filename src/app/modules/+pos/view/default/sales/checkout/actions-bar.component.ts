import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CheckoutState} from "../../../R/sales/checkout.state";
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {PosCheckoutActions} from "../../../R/sales/checkout.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-actions-bar',
             templateUrl: 'actions-bar.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutActionBarComponent implements OnInit {
  @Input() checkoutState: CheckoutState;
  @Input() quoteState: PosQuoteState;
  
  constructor(protected checkoutActions: PosCheckoutActions) { }
  
  ngOnInit() { }
  
}
