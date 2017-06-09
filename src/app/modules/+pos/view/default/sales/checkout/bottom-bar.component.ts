import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CheckoutProductActions} from "../../../R/sales/checkout/product/product.actions";
import {CheckoutProductState} from "../../../R/sales/checkout/product/product.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-bottom-bar',
             templateUrl: 'bottom-bar.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutBottomBarComponent {
  @Input() checkoutProductState: CheckoutProductState;
  
  constructor(protected checkoutProductActions: CheckoutProductActions) {}
  
  protected changePage(productGridCurrentPage: number) {
    this.checkoutProductActions.updateGridState({productGridCurrentPage});
  }
}
