import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {NotifyManager} from "../../../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-reference-number',
             templateUrl: 'reference-number.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutCartReferenceNumberComponent {
  @Input() posQuoteState: PosQuoteState;
  @Input('checkIsRefund') checkIsRefund: boolean;
  
  constructor(protected posQuoteActions: PosQuoteActions,
              protected notify: NotifyManager) {}
  
  addReferenceNumber($event) {
    this.posQuoteActions.addReferenceNumber($event.target['value']);
  }
  
}
