import {Component} from '@angular/core';
import {CheckoutState} from "../../../R/sales/checkout.state";
import {Store} from "@ngrx/store";
import {PosCheckoutActions} from "../../../R/sales/checkout.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-bottom-bar',
             templateUrl: 'bottom-bar.component.html'
           })
export class PosDefaultSalesCheckoutBottomBarComponent {
  protected checkoutState: CheckoutState;
  
  constructor(protected store: Store<any>, protected checkoutActions: PosCheckoutActions) {
    this.store.select('checkout').subscribe((checkoutState: CheckoutState) => this.checkoutState = checkoutState);
  }
  
  protected changePage(productGridCurrentPage: number) {
    this.checkoutActions.updateGridState({productGridCurrentPage});
  }
}
