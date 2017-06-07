import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {SalesState} from "../../../R/sales/sales.state";
import {PosEntitiesState} from "../../../../R/entities/entities.state";
import {ProductHelper} from "../../../../services/helper/product";
import {CheckoutState} from "../../../R/sales/checkout.state";
import {PosCheckoutActions} from "../../../R/sales/checkout.actions";
import {PosQuoteActions} from "../../../../R/quote/quote.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-grid',
             templateUrl: 'grid.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutGridComponent implements AfterViewInit {
  @ViewChild('gridProductInner') gridProductInner: ElementRef;
  
  @Input() checkoutState: CheckoutState;
  @Input() entitiesState: PosEntitiesState;
  
  constructor(protected productHelper: ProductHelper, protected checkoutActions: PosCheckoutActions, protected quoteActions: PosQuoteActions) {}
  
  ngAfterViewInit(): void {
    this.onResize();
  }
  
  protected onResize() {
    this.checkoutActions.saveGridWidthHeight(this.gridProductInner.nativeElement.offsetWidth, this.gridProductInner.nativeElement.offsetHeight);
  }
  
  protected trackByItemFn(index, product) {
    return product['id'];
  }
  
  protected viewDetail() {
    console.log("not implement");
  }
  
  protected swipe(event: string) {
    if (event === 'swipeleft') {
      this.checkoutActions.updateGridState({productGridCurrentPage: this.checkoutState.productGridCurrentPage + 1});
    } else if (event === 'swiperight') {
      this.checkoutActions.updateGridState({productGridCurrentPage: this.checkoutState.productGridCurrentPage - 1});
    }
  }
}
