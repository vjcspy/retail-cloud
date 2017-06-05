import {Component, Input, OnInit} from '@angular/core';
import {CheckoutState} from "../../../../R/sales/checkout.state";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosCheckoutActions} from "../../../../R/sales/checkout.actions";
import {NumberHelper} from "../../../../../services/helper/number-helper";
import {PosConfigState} from "../../../../../R/config/config.state";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import * as _ from 'lodash';
import {Item} from "../../../../../core/framework/quote/Model/Quote/Item";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-items',
             templateUrl: 'items.component.html'
           })
export class PosDefaultSalesCheckoutCartItemsComponent implements OnInit {
  @Input() checkoutState: CheckoutState;
  @Input() quoteState: PosQuoteState;
  @Input() configState: PosConfigState;
  
  constructor(protected checkoutActions: PosCheckoutActions, protected numberHelper: NumberHelper) { }
  
  ngOnInit() { }
  
  protected trackByItemFn(index, item) {
    return item.getProduct()['id'];
  }
  
  toggleItemInCart(event, i): void {
    if (_.indexOf(["product-name", "c-num", "cart-head", "c-name", "old-pr", "cart-row", "c-price", "p-product-name", "regular-pr"],
                  event.target.className) > -1) {
      this.checkoutActions.updateActionCartState('cartItemRowSelected', this.checkoutState.cartItemRowSelected === i ? -1 : i);
    }
  }
  
  protected getSKU(item) {
    if (item.getProduct().getTypeId() === 'configurable') {
      const child = item.getChildren()[0];
      if (child) {
        return child.getProduct().getData('sku');
      }
    } else {
      return item.getProduct().getData('sku');
    }
  }
  
  protected updateItemBuyRequest(event: Event, item: Item, key: string, isBlur: boolean = false) {
    console.log('not implement');
  }
}
