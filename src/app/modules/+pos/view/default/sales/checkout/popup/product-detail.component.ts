import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ProductOptionsActions} from "../../../../R/sales/checkout/popup/product-options.actions";
import {ProductOptionsState} from "../../../../R/sales/checkout/popup/product-options.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-product-detail',
             templateUrl: 'product-detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutPopupProductDetailComponent implements OnInit {
  @Input() productOptionsState: ProductOptionsState;
  
  indexImage: number = 0;
  
  constructor(public productOptionsActions: ProductOptionsActions) { }
  
  ngOnInit() {
  }
  
  changeIndexImage(isIncrease) {
    if (isIncrease === 1) {
      if (this.indexImage < (this.productOptionsState.product.media_gallery.length - 1)) {
        this.indexImage += 1;
      }
    } else {
      if (this.indexImage > 0) {
        this.indexImage -= 1;
      }
    }
  }
}
