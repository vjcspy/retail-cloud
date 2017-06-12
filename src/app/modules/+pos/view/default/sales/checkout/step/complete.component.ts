import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-step-complete',
             templateUrl: 'complete.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutStepCompleteComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
  
}
