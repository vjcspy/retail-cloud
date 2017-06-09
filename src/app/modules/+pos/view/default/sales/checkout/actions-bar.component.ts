import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CartActionBarState} from "../../../R/sales/checkout/cart/action-bar.state";
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {CartCustomerState} from "../../../R/sales/checkout/cart/customer.state";
import {CartCustomerActions} from "../../../R/sales/checkout/cart/customer.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-actions-bar',
             templateUrl: 'actions-bar.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutActionBarComponent implements OnInit {
  @Input() cartActionBarState: CartActionBarState;
  @Input() quoteState: PosQuoteState;
  @Input() cartCustomerState: CartCustomerState;
  
  constructor(protected cartCustomerActions:CartCustomerActions){}
  
  ngOnInit() { }
  
}