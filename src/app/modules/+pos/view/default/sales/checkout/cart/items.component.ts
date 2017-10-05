import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosConfigState} from "../../../../../R/config/config.state";
import {CartItemState} from "../../../../R/sales/checkout/cart/item.state";
import {CartCustomerState} from "../../../../R/sales/checkout/cart/customer.state";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {CartCustomerActions} from "../../../../R/sales/checkout/cart/customer.actions";
import {Customer} from "../../../../../core/framework/customer/Model/Customer";
import {CheckoutPopupActions} from "../../../../R/sales/checkout/popup/popup.actions";
import {CheckoutPopup} from "../../../../R/sales/checkout/popup/popup.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-items',
             templateUrl: 'items.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })
export class PosDefaultSalesCheckoutCartItemsComponent {
  @Input() quoteState: PosQuoteState;
  @Input() configState: PosConfigState;
  @Input() cartItemState: CartItemState;
  @Input() cartCustomerState: CartCustomerState;
  
  protected customerInfo;
  
  constructor(protected posQuoteActions: PosQuoteActions,
              protected cartCustomerActions: CartCustomerActions,
              protected checkoutPopupActions: CheckoutPopupActions) { }
  
  trackByProduct(index, item) {
    return item.getData('product');
  }
  
  customerAction($event, iconAction: boolean = false) {
    const customer = this.quoteState.customer;
    
    if (iconAction === false && $event.target.className.indexOf('customer-icon-action') === -1) {
      if (customer && customer['id'] && customer.getId() !== this.configState.setting.customer.getDefaultCustomerId()) {
        // show popup
        this.checkoutPopupActions.checkoutOpenPopup(CheckoutPopup.CUSTOMER_BILLING, {customerPopup: {customer}});
      } else {
        this.cartCustomerActions.updateActionCartState('inSearchCustomers', true);
      }
    } else if (iconAction === true && $event.target.className.indexOf('customer-icon-action') > -1) {
      if (customer && customer['id'] && customer.getId() !== this.configState.setting.customer.getDefaultCustomerId()) {
        // remove customer
        this.posQuoteActions.setCustomerToQuote(new Customer());
      } else {
        this.cartCustomerActions.updateActionCartState('inSearchCustomers', true);
      }
    }
  }
  
  getCustomerInfo(force: boolean = false) {
    if (typeof this.customerInfo === 'undefined' || force) {
      const customer = this.quoteState.customer;
      let customerName;
      let customerEmail;
      if (customer && customer['id'] && parseInt(customer['id'] + '') !== parseInt(this.configState.setting.customer.getDefaultCustomerId())) {
        customerName  = customer['first_name'] + " " + customer['last_name'];
        customerEmail = customer['email'];
      } else {
        customerName  = 'Guest Customer';
        customerEmail = '';
      }
      
      this.customerInfo = {customerName, customerEmail};
    }
    return this.customerInfo;
  }
  
  checkoutAsGuest(): boolean {
    const customer = this.quoteState.customer;
    if (customer && customer['id'] && parseInt(customer['id'] + '') !== parseInt(this.configState.setting.customer.getDefaultCustomerId())) {
      return false;
    } else {
      return true;
    }
  }
}
