import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CheckoutProductState} from "../../../R/sales/checkout/product/product.state";
import {PosQuoteActions} from "../../../../R/quote/quote.actions";
import {CheckoutProductActions} from "../../../R/sales/checkout/product/product.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutListComponent implements OnInit {
  @Input() checkoutProductState: CheckoutProductState;
  
  constructor(protected quoteActions: PosQuoteActions,
              protected checkoutProductActions: CheckoutProductActions) { }
  
  ngOnInit() { }
  
  protected trackByItemFn(index, product) {
    return product['id'];
  }
  
  addToCart(product, $event) {
    const className = $event.target.className;
    if (!!className && className.indexOf('btn-detail') === -1) {
      this.quoteActions.selectProductToAdd(product);
    }
  }
  
  loadMorePage() {
    setTimeout(() => {
      this.checkoutProductActions.loadMorePage();
    }, 50);
  }
}
