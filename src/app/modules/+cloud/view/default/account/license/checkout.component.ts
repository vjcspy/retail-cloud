import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CheckoutActions} from "../../../../R/sales/checkout/actions";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {CheckoutState} from "../../../../R/sales/checkout/state";
import {CloudState} from "../../../../R/index";
import {ActivatedRoute} from "@angular/router";
import {NotifyManager} from "../../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'account-license-checkout-component',
             templateUrl: 'checkout.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountLicenseCheckoutComponent implements OnInit {
  paymentMethod: string;
  
  checkoutState$: Observable<CheckoutState>;
  
  constructor(protected checkoutActions: CheckoutActions,
              protected store$: Store<any>,
              protected notify: NotifyManager,
              protected route: ActivatedRoute) {
    this.checkoutState$ = this.store$.map((cloudState: CloudState) => cloudState.sales.checkout);
  }
  
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params) {
        const {planId} = params;
        
        if (!planId) {
          this.notify.error('can_load_data');
        } else {
          this.checkoutActions.initCheckoutPayment(planId);
        }
      }
    });
  }
  
}
