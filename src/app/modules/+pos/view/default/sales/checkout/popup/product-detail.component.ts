import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CheckoutState} from "../../../../R/sales/checkout.state";
import {PosCheckoutActions} from "../../../../R/sales/checkout.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-product-detail',
             templateUrl: 'product-detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutPopupProductDetailComponent implements OnInit {
  @Input() checkoutState: CheckoutState;
  
  indexImage: number = 0;
  
  constructor(public checkoutActions: PosCheckoutActions) { }
  
  ngOnInit() { }
  
  changeIndexImage(isIncrease) {
    if (isIncrease === 1) {
      if (this.indexImage < (this.checkoutState.productOptions.product.media_gallery.length - 1)) {
        this.indexImage += 1;
      }
    } else {
      if (this.indexImage > 0) {
        this.indexImage -= 1;
      }
    }
  }
}
