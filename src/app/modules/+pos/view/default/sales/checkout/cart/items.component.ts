import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import * as _ from 'lodash';
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosConfigState} from "../../../../../R/config/config.state";
import {NumberHelper} from "../../../../../services/helper/number-helper";
import {Item} from "../../../../../core/framework/quote/Model/Quote/Item";
import {CartItemState} from "../../../../R/sales/checkout/cart/item.state";
import {CartCustomerState} from "../../../../R/sales/checkout/cart/customer.state";
import {CartItemActions} from "../../../../R/sales/checkout/cart/item.actions";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {QuoteItemActions} from "../../../../../R/quote/item/item.actions";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {CartCustomerActions} from "../../../../R/sales/checkout/cart/customer.actions";
import {Customer} from "../../../../../core/framework/customer/Model/Customer";

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
  
  constructor(protected cartItemActions: CartItemActions,
              protected numberHelper: NumberHelper,
              protected posQuoteActions: PosQuoteActions,
              protected quoteItemActions: QuoteItemActions,
              protected notify: NotifyManager,
              protected cartCustomerActions: CartCustomerActions) { }
  
  toggleItemInCart(event, i): void {
    if (_.indexOf(["product-name", "c-num", "cart-head", "c-name", "old-pr", "cart-row", "c-price", "p-product-name", "regular-pr"],
                  event.target.className) > -1) {
      this.cartItemActions.changeRowSelected(this.cartItemState.cartItemRowSelected === i ? -1 : i);
    }
  }
  
  getSKU(item) {
    if (item.getProduct().getTypeId() === 'configurable') {
      const child = item.getChildren()[0];
      if (child) {
        return child.getProduct().getData('sku');
      }
    } else {
      return item.getProduct().getData('sku');
    }
  }
  
  updateItemBuyRequest(event: Event, item: Item, key: string) {
    const value = event.target['value'];
    if (isNaN(value) || parseFloat(value) < 0) {
      this.notify.warning("check_item_buy_request");
    } else {
      this.quoteItemActions.updateItemBuyRequest(key, event.target['value'], item);
    }
  }
  
  switchDiscountPerItemType(item: Item, isDiscountValue: boolean = true) {
    if (item.getBuyRequest().getData('is_discount_value') === isDiscountValue) {
      return;
    }
    
    item.getBuyRequest().setData('is_discount_value', isDiscountValue);
    this.quoteItemActions.updateItemBuyRequest('discount_per_item', 0, item);
  }
  
  getItemImage(item) {
    const originImage = item.getProduct().getData('origin_image');
    if (_.isString(originImage)) {
      return originImage;
    }
    else {
      return '/assets/img/no-image.jpg';
    }
  }
  
  customerAction($event, iconAction: boolean = false) {
    const customer = this.quoteState.customer;
    
    if (iconAction === false && $event.target.className.indexOf('customer-icon-action') === -1) {
      if (customer && customer['id'] && customer.getId() !== this.configState.setting.customer.getDefaultCustomerId()) {
        // show popup
      } else {
        this.cartCustomerActions.updateActionCartState('inSearchCustomers', true);
      }
    } else if (iconAction === true && $event.target.className.indexOf('customer-icon-action') > -1) {
      if (customer && customer['id'] && customer.getId() !== this.configState.setting.customer.getDefaultCustomerId()) {
        // remove customer
        this.posQuoteActions.setCustomerToQuote(new Customer(), true);
      } else {
        this.cartCustomerActions.updateActionCartState('inSearchCustomers', true);
      }
    }
  }
  
  getCustomerInfo(force: boolean = false) {
    if (typeof this.customerInfo === 'undefined' || force) {
      const customer = this.quoteState.customer;
      let customerName, customerEmail;
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
}
