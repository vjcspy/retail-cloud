import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PaymentMethod, PosStepState} from "../../../../../R/sales/checkout/step/step.state";
import {PosStepActions} from "../../../../../R/sales/checkout/step/step.actions";
import * as _ from 'lodash';

@Component({
             //moduleId: module.id,
             selector: 'checkout-cash',
             templateUrl: 'cash.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CheckoutCashComponent {
  @Input() method: PaymentMethod;
  @Input() posStepState: PosStepState;
  
  constructor(public posStepActions: PosStepActions) {}
  
  changeAmount(value) {
    value += '';
    if (isNaN(value) || !value) {
      value = 0;
    }
    if (value.indexOf(".") === (value.length - 1) || value.indexOf(",") === (value.length - 1)) {
      return;
    }
  }
  
  remove() {
    this.posStepActions.removePaymentMethodFromOrder(this.method);
  }
}
