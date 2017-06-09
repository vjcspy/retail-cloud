import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CheckoutState} from "../../../R/sales/checkout.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup',
             templateUrl: 'popup.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutPopupComponent implements OnInit {
  @Input() checkoutState: CheckoutState;
  
  constructor() { }
  
  ngOnInit() { }
  
}
