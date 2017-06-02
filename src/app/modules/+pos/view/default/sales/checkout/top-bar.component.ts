import {Component, Input, OnInit} from '@angular/core';
import {CheckoutState} from "../../../R/sales/checkout.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-top-bar',
             templateUrl: 'top-bar.component.html'
           })
export class PosDefaultSalesCheckoutTopBarComponent implements OnInit {
  @Input() checkoutState: CheckoutState;
  
  ngOnInit() { }
  
}
