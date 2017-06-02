import {Component, Input} from '@angular/core';
import {CheckoutState} from "../../../R/sales/checkout.state";
import {PosCheckoutActions} from "../../../R/sales/checkout.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-bottom-bar',
             templateUrl: 'bottom-bar.component.html'
           })
export class PosDefaultSalesCheckoutBottomBarComponent {
  @Input() checkoutState: CheckoutState;
  
  constructor(protected checkoutActions: PosCheckoutActions) {
  }
  
  protected changePage(productGridCurrentPage: number) {
    this.checkoutActions.updateGridState({productGridCurrentPage});
  }
}
