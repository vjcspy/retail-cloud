import {Component, Input} from '@angular/core';
import {PosQuoteState} from "../../../../R/quote/quote.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-grand-total',
             templateUrl: 'grand-total.component.html'
           })
export class PosDefaultSalesCheckoutGrandTotalComponent {
  @Input() quoteState: PosQuoteState;
  
  protected syncOrder() {
    console.log('not implement');
  }
}
