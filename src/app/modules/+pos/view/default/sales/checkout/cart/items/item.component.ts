import {Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit, Renderer2, AfterViewInit} from '@angular/core';
import {NumberHelper} from "../../../../../../services/helper/number-helper";
import {PosConfigState} from "../../../../../../R/config/config.state";
import {QuoteItemActions} from "../../../../../../R/quote/item/item.actions";
import {CartItemActions} from "../../../../../R/sales/checkout/cart/item.actions";
import {PosQuoteActions} from "../../../../../../R/quote/quote.actions";
import {NotifyManager} from "../../../../../../../../services/notify-manager";
import {Item} from "../../../../../../core/framework/quote/Model/Quote/Item";
import * as _ from 'lodash';
import {CartItemState} from "../../../../../R/sales/checkout/cart/item.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-items-item',
             templateUrl: 'item.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class PosDefaultSalesCheckoutCartItemsItemComponent implements OnInit, AfterViewInit {
  @Input() item;
  @Input() i;
  @Input() configState: PosConfigState;
  @Input() cartItemState: CartItemState;
  @ViewChild('itemElem') itemElem: ElementRef;
  
  constructor(protected cartItemActions: CartItemActions,
              protected numberHelper: NumberHelper,
              protected posQuoteActions: PosQuoteActions,
              protected quoteItemActions: QuoteItemActions,
              protected notify: NotifyManager,
              protected render2: Renderer2) { }
  
  ngOnInit(): void {
    setTimeout(() => {
      this.render2.removeClass(this.itemElem.nativeElement, 'animated');
    }, 2000);
  }
  
  ngAfterViewInit(): void {
    this.scrollToThisElem();
  }
  
  protected scrollToThisElem() {
    document.getElementById('cart-table-items').scrollTop = this.itemElem.nativeElement.offsetTop - 10;
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
  
  updateItemBuyRequest(event: Event, item: Item, key: string) {
    let value = <any>event.target['value'];
    if (_.isString(value)) {
      value = <any>_.replace(value, new RegExp(",", 'g'), "");
    }
    if (key === 'qty') {
      if (!item.getProduct()['stock_items'] || item.getProduct()['stock_items']['is_qty_decimal'] !== '1') {
        value = Math.round(value);
        event.target['value'] = parseFloat(value).toFixed(2);
      }
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      this.notify.warning("check_item_buy_request");
    } else {
      this.quoteItemActions.updateItemBuyRequest(key, value, item);
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
    } else {
      return '/assets/img/no-image.jpg';
    }
  }
}
