import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ProductOptionsState} from "../../../R/sales/checkout/popup/product-options.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup',
             templateUrl: 'popup.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutPopupComponent implements OnInit {
  @Input() productOptionsState: ProductOptionsState;
  
  constructor() { }
  
  ngOnInit() { }
  
}
