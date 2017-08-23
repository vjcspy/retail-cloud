import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {CartCustomerState} from "../../../R/sales/checkout/cart/customer.state";
import {PosConfigState} from "../../../../R/config/config.state";
import {CartItemState} from "../../../R/sales/checkout/cart/item.state";
import {CartTotalsState} from "../../../R/sales/checkout/cart/totals.state";
import {RouterActions} from "../../../../../../R/router/router.actions";
import {RootState} from "../../../../../../R/root.state";

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
  
  constructor(private routerActions: RouterActions) { }
  
  openShift() {
    this.routerActions.go('pos/default/sales/shifts');
  }
}
