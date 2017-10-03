import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ProductOptionsState} from "../../../R/sales/checkout/popup/product-options.state";
import {CheckoutPopup, CheckoutPopupState} from "../../../R/sales/checkout/popup/popup.state";
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {PosConfigState} from "../../../../R/config/config.state";
import {PosEntitiesState} from "../../../../R/entities/entities.state";
import {CheckoutPopupActions} from "../../../R/sales/checkout/popup/popup.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup',
             templateUrl: 'popup.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutPopupComponent {
  @Input() productOptionsState: ProductOptionsState;
  @Input() checkoutPopupState: CheckoutPopupState;
  @Input() posQuoteState: PosQuoteState;
  @Input() posConfigState: PosConfigState;
  @Input() entitiesState: PosEntitiesState;
  
  constructor(protected checkoutPopupActions: CheckoutPopupActions) {}
  
  isOpenCustomSalePopup() {
    return this.checkoutPopupState.popupOpening === CheckoutPopup.CUSTOM_SALE;
  }
  
  clickOutside(event: boolean) {
    if (event === false) {
      this.checkoutPopupActions.checkoutOpenPopup(null);
    }
  }
}