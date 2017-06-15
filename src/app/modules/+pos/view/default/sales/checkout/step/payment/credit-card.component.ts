import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PosStepActions} from "../../../../../R/sales/checkout/step/step.actions";
import {PaymentMethod, PosStepState} from "../../../../../R/sales/checkout/step/step.state";

@Component({
             //moduleId: module.id,
             selector: 'checkout-credit-card',
             templateUrl: 'credit-card.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CheckoutCreditCardComponent {
  @Input() method: PaymentMethod;
  @Input() posStepState: PosStepState;
  
  constructor(public posStepActions: PosStepActions) {}
  
  changeAmount(value) {
    if (isNaN(value) || !value) {
      value = 0;
    }
    value += '';
    if (value.indexOf(".") === (value.length - 1) || value.indexOf(",") === (value.length - 1)) {
      return;
    }
    
    this.posStepActions.changeAmountPayment(this.method, parseFloat(value));
  }
  
  remove() {
    this.posStepActions.removePaymentMethodFromOrder(this.method);
  }
}
