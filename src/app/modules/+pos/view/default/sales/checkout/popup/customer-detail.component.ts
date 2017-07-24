import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {CheckoutPopup, CheckoutPopupState} from "../../../../R/sales/checkout/popup/popup.state";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {CheckoutPopupActions} from "../../../../R/sales/checkout/popup/popup.actions";
import {PosQuoteState} from "../../../../../R/quote/quote.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-customer-detail',
             templateUrl: 'customer-detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupCustomerDetailComponent {
  @Input() checkoutPopupState: CheckoutPopupState;
  @Input() entitiesState: PosEntitiesState;
  @Input() quoteState: PosQuoteState;
  
  constructor(protected checkoutPopupActions: CheckoutPopupActions) {}
  
  isOpenCustomerBilling() {
    return this.checkoutPopupState.popupOpening === CheckoutPopup.CUSTOMER_BILLING;
  }
  
  isOpenCustomerShipping() {
    return this.checkoutPopupState.popupOpening === CheckoutPopup.CUSTOMER_SHIPPING;
  }
  
  clickOutside(event: boolean) {
    if (event === false) {
      this.checkoutPopupActions.checkoutOpenPopup(null);
    }
  }
}
