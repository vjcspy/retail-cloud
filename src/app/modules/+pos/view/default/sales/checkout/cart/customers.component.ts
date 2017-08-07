import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CartCustomerState} from "../../../../R/sales/checkout/cart/customer.state";
import {PosConfigState} from "../../../../../R/config/config.state";
import {FormControl} from "@angular/forms";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {CartCustomerActions} from "../../../../R/sales/checkout/cart/customer.actions";
import {AbstractSubscriptionComponent} from "../../../../../../../code/AbstractSubscriptionComponent";
import {CheckoutPopupActions} from "../../../../R/sales/checkout/popup/popup.actions";
import {CheckoutPopup} from "../../../../R/sales/checkout/popup/popup.state";
import {Customer} from "../../../../../core/framework/customer/Model/Customer";
import {OfflineService} from "../../../../../../share/provider/offline";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-customers',
             templateUrl: 'customers.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })
export class PosDefaultSalesCheckoutCartCustomersComponent extends AbstractSubscriptionComponent implements AfterViewInit {
  @Input() configState: PosConfigState;
  @Input() cartCustomerState: CartCustomerState;
  protected cartCustomerSearchString = new FormControl();
  
  constructor(protected cartCustomerActions: CartCustomerActions,
              protected quoteActions: PosQuoteActions,
              protected offline: OfflineService,
              protected checkoutPopupActions: CheckoutPopupActions) {
    super();
  }
  
  ngAfterViewInit(): void {
    this.subscribeObservable('subscribe_search_customer',
                             () => this.cartCustomerSearchString
                                       .valueChanges
                                       .debounceTime(this.configState.constrain.debounceTimeSearch)
                                       .distinctUntilChanged()
                                       .subscribe((cartCustomerSearchString: string) => {
                                         this.cartCustomerActions.searchCustomer(cartCustomerSearchString);
                                       }));
  }
  
  protected customerTrackBy(index, customer: any) {
    return customer['id'];
  }
  
  createNewCustomer() {
    this.checkoutPopupActions.checkoutOpenPopup(CheckoutPopup.CUSTOMER_BILLING, {customerPopup: {customer: new Customer(), addressState: 'edit'}});
  }
}
