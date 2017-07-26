import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CheckoutPopupState} from "../../../../../R/sales/checkout/popup/popup.state";
import {PosQuoteState} from "../../../../../../R/quote/quote.state";
import {PosConfigState} from "../../../../../../R/config/config.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-customer-detail-address',
             templateUrl: 'address.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupCustomerDetailAddressComponent {
  @Input() checkoutPopupState: CheckoutPopupState;
  @Input() quoteState: PosQuoteState;
  @Input() posConfigState: PosConfigState;
}
