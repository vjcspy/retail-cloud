import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PosQuoteState} from "../../../../R/quote/quote.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-grand-total',
             templateUrl: 'grand-total.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutGrandTotalComponent {
  @Input() quoteState: PosQuoteState;
  protected isLoading: boolean = false;
  
  protected syncOrder() {
    this.isLoading = true;
  }
}
