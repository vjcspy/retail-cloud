import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'account-license-checkout-component',
             templateUrl: 'checkout.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountLicenseCheckoutComponent implements OnInit {
  grandtotal: number = 100;
  paymentMethod: string;
  
  constructor() { }
  
  ngOnInit() { }
}
