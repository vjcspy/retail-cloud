import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AbstractSubscriptionComponent} from "../../../../../../code/AbstractSubscriptionComponent";
import {CheckoutProductState} from "../../../R/sales/checkout/product/product.state";
import {PosConfigState} from "../../../../R/config/config.state";
import {FormControl} from "@angular/forms";
import {CheckoutProductActions} from "../../../R/sales/checkout/product/product.actions";
import {MenuLeftActions} from "../../../R/sales/menu/left/left.actions";
import {CheckoutPopupActions} from "../../../R/sales/checkout/popup/popup.actions";
import {CheckoutPopup} from "../../../R/sales/checkout/popup/popup.state";
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {NotifyManager} from "../../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-top-bar',
             templateUrl: 'top-bar.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutTopBarComponent extends AbstractSubscriptionComponent implements AfterViewInit {
  @Input() checkoutProductState: CheckoutProductState;
  @Input() configState: PosConfigState;
  @Input() quoteState: PosQuoteState;
  
  protected searchString = new FormControl();
  
  constructor(private checkoutProductActions: CheckoutProductActions,
              public menuLeftActions: MenuLeftActions,
              protected notify: NotifyManager,
              protected checkoutPopupActions: CheckoutPopupActions) {
    super();
  }
  
  ngAfterViewInit(): void {
    this.subscribeObservable('subscribe_input_search', () => this.searchString
                                                                 .valueChanges
                                                                 .debounceTime(this.configState.constrain['debounceTimeSearch'])
                                                                 .distinctUntilChanged()
                                                                 .subscribe((searchString: string) => this.checkoutProductActions.updateGridState({
                                                                                                                                                    searchString,
                                                                                                                                                    lastLuckySearchString: null
                                                                                                                                                  }))
    );
  }
  
  openPopupCustomSale() {
    if (!this.configState.posRetailConfig.enableCustomSale) {
      this.notify.error("do_not_allow_checkout_with_custom_sale");
      return false;
    }
    this.checkoutPopupActions.checkoutOpenPopup(CheckoutPopup.CUSTOM_SALE);
  }
  
  openPopupShipping() {
    if (this.canAddShipment()) {
      this.checkoutPopupActions.checkoutOpenPopup(CheckoutPopup.CUSTOMER_SHIPPING, {customerPopup: {customer: this.quoteState.customer}});
    }
  }
  
  canAddShipment() {
    return this.quoteState.items.count() > 0 && this.quoteState.customer && !!this.quoteState.customer['id'];
  }
}
