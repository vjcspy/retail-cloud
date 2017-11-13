import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BraintreeActions} from "../R/braintree/actions";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {BraintreeState} from "../R/braintree/state";

@Component({
             // moduleId: module.id,
             selector: 'braintree-payment-component',
             templateUrl: 'payment.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class PaymentComponent implements OnInit {
  braintreeState$: Observable<BraintreeState>;
  
  constructor(protected braintreeActions: BraintreeActions, protected store$: Store<any>) {
    this.braintreeState$ = this.store$.select('braintree');
  }
  
  ngOnInit() {
    this.braintreeActions.dropinCreate();
  }
  
  requestPaymentMethod() {
    this.braintreeActions.requestPaymentMethod();
  }
}
