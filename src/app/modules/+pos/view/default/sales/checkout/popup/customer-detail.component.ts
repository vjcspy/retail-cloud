import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {CheckoutPopup, CheckoutPopupState} from "../../../../R/sales/checkout/popup/popup.state";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-customer-detail',
             templateUrl: 'customer-detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupCustomerDetailComponent {
  @Input() checkoutPopupState: CheckoutPopupState;
  @Input() entitiesState: PosEntitiesState;
  
  isOpenCustomerBilling() {
    return this.checkoutPopupState.popupOpening === CheckoutPopup.CUSTOMER_BILLING;
  }
}
