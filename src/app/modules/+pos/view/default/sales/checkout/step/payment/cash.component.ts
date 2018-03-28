import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PaymentMethod, PosStepState} from "../../../../../R/sales/checkout/step/step.state";
import {PosStepActions} from "../../../../../R/sales/checkout/step/step.actions";
import {NumberHelper} from "../../../../../../services/helper/number-helper";
import {RoundingCash} from "../../../../../../services/helper/rounding-cash";
import {PosConfigState} from "../../../../../../R/config/config.state";

@Component({
             //moduleId: module.id,
             selector: 'checkout-cash',
             templateUrl: 'cash.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CheckoutCashComponent {
  @Input() method: PaymentMethod;
  @Input() posStepState: PosStepState;
  @Input() posConfigState: PosConfigState;
  
  private roundingCash = new RoundingCash();
  
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
    
    this.roundingCash.setConfigRoundingCash(this.posConfigState.roundingCash);
    let amount = this.roundingCash.getRoundingCash(parseFloat(value));
    
    this.posStepActions.changeAmountPayment(this.method, amount);
  }
  
  remove() {
    this.posStepActions.removePaymentMethodFromOrder(this.method);
  }
}
