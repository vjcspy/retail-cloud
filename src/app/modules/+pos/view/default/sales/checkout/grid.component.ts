import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import {CheckoutProductState} from "../../../R/sales/checkout/product/product.state";
import {CheckoutProductActions} from "../../../R/sales/checkout/product/product.actions";
import {PosQuoteActions} from "../../../../R/quote/quote.actions";
import {ProductHelper} from "../../../../core/framework/catalog/Helper/Product";
import {TutorialService} from "../../../../modules/+tutorial/tutorial.service";

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
              protected quoteActions: PosQuoteActions,
              protected tourService: TutorialService) {}
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tourService.enableNextButton();
    }, 1000);
    this._onResize();
  }
  
  protected _onResize() {
    this.checkoutProductActions.saveGridWidthHeight(this.gridProductInner.nativeElement.offsetWidth + 10, this.gridProductInner.nativeElement.offsetHeight);
  }
  
  protected trackByItemFn(index, product) {
    return product['id'];
  }
  
  // protected swipe(event: string) {
  //   if (event === 'swipeleft') {
  //     this.checkoutProductActions.updateGridState({productGridCurrentPage: this.checkoutProductState.productGridCurrentPage + 1});
  //   } else if (event === 'swiperight') {
  //     this.checkoutProductActions.updateGridState({productGridCurrentPage: this.checkoutProductState.productGridCurrentPage - 1});
  //   }
  // }
  
  isSales(product) {
    return ProductHelper.isSales(product);
  }
  
  isOutOfStock(product) {
    return ProductHelper.isOutOfStock(product);
  }
  
  loadMorePage() {
    setTimeout(() => {
      this.checkoutProductActions.loadMorePage();
    }, 50);
  }
  
  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this._onResize();
  }
  
  selectProductToAdd(product) {
    this.tourService.tour.pause();
    this.tourService.dispatchPauseTour();
    this.quoteActions.selectProductToAdd(product);
  }
  
}
