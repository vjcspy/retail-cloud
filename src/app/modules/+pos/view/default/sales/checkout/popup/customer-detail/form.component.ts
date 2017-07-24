import {ChangeDetectionStrategy, Component, OnInit, Input} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-customer-detail-form',
             templateUrl: 'form.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupCustomerDetailFormComponent implements OnInit {
  
  constructor() { }
  
  ngOnInit() { }
}
