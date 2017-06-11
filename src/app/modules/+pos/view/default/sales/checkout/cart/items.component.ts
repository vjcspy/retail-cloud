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
  
  constructor(protected cartItemActions: CartItemActions, protected numberHelper: NumberHelper, protected posQuoteActions: PosQuoteActions) { }
  
  trackByItemFn(index, item) {
    return item.getProduct()['id'];
  }
  
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
  
  updateItemBuyRequest(event: Event, item: Item, key: string, isBlur: boolean = false) {
    console.log('not implement');
  }
}
