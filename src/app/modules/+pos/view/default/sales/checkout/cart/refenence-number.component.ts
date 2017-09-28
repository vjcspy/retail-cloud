import {Component, Input} from '@angular/core';
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {NotifyManager} from "../../../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-reference-number',
             templateUrl: 'reference-number.component.html',
           })
export class PosDefaultSalesCheckoutCartReferenceNumberComponent {
  @Input() posQuoteState: PosQuoteState;
  public referenceNumber;
  
  constructor(protected posQuoteActions: PosQuoteActions) {}
  
  addReferenceNumber($event) {
      this.posQuoteActions.addReferenceNumber($event.target['value']);
  }
  
}
