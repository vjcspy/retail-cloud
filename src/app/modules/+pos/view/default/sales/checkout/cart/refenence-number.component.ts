import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-reference-number',
             templateUrl: 'reference-number.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutCartReferenceNumberComponent {
  @Input() posQuoteState: PosQuoteState;
  @Input('checkIsRefund') checkIsRefund: boolean;
  
  constructor(protected posQuoteActions: PosQuoteActions) {}
  
  addReferenceNumber($event) {
      this.posQuoteActions.addReferenceNumber($event.target['value']);
  }
  
}
