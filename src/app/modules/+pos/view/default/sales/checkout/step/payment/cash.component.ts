import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PaymentMethod, PosStepState} from "../../../../../R/sales/checkout/step/step.state";
import {PosStepActions} from "../../../../../R/sales/checkout/step/step.actions";
import {NumberHelper} from "../../../../../../services/helper/number-helper";

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
    if (isNaN(value) || !value) {
      value = 0;
    }
    value += '';
    if (value.indexOf(".") === (value.length - 1) || value.indexOf(",") === (value.length - 1)) {
      value                 = NumberHelper.round(value);
      event.target['value'] = value;
      // return;
    }
    
    this.posStepActions.changeAmountPayment(this.method, parseFloat(value));
  }
  
  remove() {
    this.posStepActions.removePaymentMethodFromOrder(this.method);
  }
}
