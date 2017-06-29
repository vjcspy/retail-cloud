import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {PosEntitiesState} from "../../../../R/entities/entities.state";
import {CheckoutProductState} from "../../../R/sales/checkout/product/product.state";
import {CheckoutProductActions} from "../../../R/sales/checkout/product/product.actions";
import {PosQuoteActions} from "../../../../R/quote/quote.actions";
import {ProductHelper} from "../../../../core/framework/catalog/Helper/Product";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-grid',
             templateUrl: 'grid.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutGridComponent implements AfterViewInit {
  @ViewChild('gridProductInner') gridProductInner: ElementRef;
  
  @Input() checkoutProductState: CheckoutProductState;
  
  constructor(protected checkoutProductActions: CheckoutProductActions,
              protected quoteActions: PosQuoteActions) {}
  
  ngAfterViewInit(): void {
    this.onResize();
  }
  
  protected onResize() {
    this.checkoutProductActions.saveGridWidthHeight(this.gridProductInner.nativeElement.offsetWidth, this.gridProductInner.nativeElement.offsetHeight);
  }
  
  protected trackByItemFn(index, product) {
    return product['id'];
  }
  
  protected viewDetail() {
    console.log("not implement");
  }
  
  protected swipe(event: string) {
    if (event === 'swipeleft') {
      this.checkoutProductActions.updateGridState({productGridCurrentPage: this.checkoutProductState.productGridCurrentPage + 1});
    } else if (event === 'swiperight') {
      this.checkoutProductActions.updateGridState({productGridCurrentPage: this.checkoutProductState.productGridCurrentPage - 1});
    }
  }
  
  isSales(product) {
    return ProductHelper.isSales(product);
  }
  
  isOutOfStock(product) {
    return ProductHelper.isOutOfStock(product);
  }
  
  loadMorePage() {
    setTimeout(() => {
      this.checkoutProductActions.loadMorePage();
    }, 250);
  }
}
