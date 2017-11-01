import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {CartCustomerState} from "../../../R/sales/checkout/cart/customer.state";
import {PosConfigState} from "../../../../R/config/config.state";
import {CartItemState} from "../../../R/sales/checkout/cart/item.state";
import {CartTotalsState} from "../../../R/sales/checkout/cart/totals.state";
import {RouterActions} from "../../../../../../R/router/router.actions";
import {RootState} from "../../../../../../R/root.state";
import {AuthenticateService} from "../../../../../../services/authenticate";
import {NotifyManager} from "../../../../../../services/notify-manager";
import {OfflineService} from "../../../../../share/provider/offline";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart',
             templateUrl: 'cart.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutCartComponent {
  @Input() quoteState: PosQuoteState;
  @Input() cartCustomerState: CartCustomerState;
  @Input() configState: PosConfigState;
  @Input() cartItemState: CartItemState;
  @Input() cartTotalsState: CartTotalsState;
  @Input() rootState: RootState;
  
  constructor(private routerActions: RouterActions,
              private authenticateService: AuthenticateService,
              private toastr: NotifyManager,
              private offline: OfflineService) { }
  
  openShift() {
    if (this.authenticateService.userCan('view_register')) {
      if (this.offline.online) {
        this.routerActions.go('pos/default/sales/shifts');
      }
    } else {
      this.toastr.error("not_have_permission_to_view_register");
    }
  }
}
