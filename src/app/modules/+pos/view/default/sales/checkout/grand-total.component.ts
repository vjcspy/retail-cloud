import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {PosSyncActions} from "../../../../R/sync/sync.actions";
import {PosSyncState} from "../../../../R/sync/sync.state";
import {AuthenticateService} from "../../../../../../services/authenticate";
import {NotifyManager} from "../../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-grand-total',
             templateUrl: 'grand-total.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutGrandTotalComponent {
  @Input() quoteState: PosQuoteState;
  @Input() posSyncState: PosSyncState;
  
  constructor(public posSyncActions: PosSyncActions,
              protected notify: NotifyManager,
              protected authService: AuthenticateService) {}
  
  goCheckoutStep() {
    if (this.authService.userCan('create_order')) {
      if (this.quoteState.items.count() > 0 || this.quoteState.info.isRefunding) {
        this.posSyncActions.syncCurrentOrder();
      }
    } else {
      this.notify.error("not_have_permission_to_create_orders");
    }
  }
}
