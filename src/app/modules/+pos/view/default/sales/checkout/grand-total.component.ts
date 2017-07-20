import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {PosSyncActions} from "../../../../R/sync/sync.actions";
import {PosSyncState} from "../../../../R/sync/sync.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-grand-total',
             templateUrl: 'grand-total.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutGrandTotalComponent {
  @Input() quoteState: PosQuoteState;
  @Input() posSyncState: PosSyncState;
  
  constructor(public posSyncActions: PosSyncActions) {}
  
  goCheckoutStep() {
    if (this.quoteState.items.count() > 0 || this.quoteState.info.isRefunding) {
      this.posSyncActions.syncCurrentOrder();
    }
  }
}
