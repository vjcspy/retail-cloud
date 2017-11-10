import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CheckoutActions} from "../../../../R/sales/checkout/actions";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {CheckoutState} from "../../../../R/sales/checkout/state";
import {CloudState} from "../../../../R/index";

@Component({
             // moduleId: module.id,
             selector: 'account-license-checkout-component',
             templateUrl: 'checkout.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountLicenseCheckoutComponent implements OnInit {
  grandtotal: number = 100;
  paymentMethod: string;
  
  checkoutState$: Observable<CheckoutState>;
  
  constructor(protected checkoutActions: CheckoutActions,
              protected store$: Store<any>) {
    this.checkoutState$ = this.store$.map((cloudState: CloudState) => cloudState.sales.checkout);
  }
  
  ngOnInit() {
    this.checkoutActions.initCheckoutPayment();
  }
  
}
