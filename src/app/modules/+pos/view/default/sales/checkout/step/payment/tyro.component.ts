import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import * as _ from "lodash";
import {PosStepActions} from "../../../../../R/sales/checkout/step/step.actions";
import {Payment3rd, PaymentMethod, PosStepState} from "../../../../../R/sales/checkout/step/step.state";
import {TyroActions} from "../../../../../R/sales/checkout/step/payment/tyro.actions";
import {NumberHelper} from "../../../../../../services/helper/number-helper";

@Component({
             //moduleId: module.id,
             selector: 'checkout-payment-tyro',
             templateUrl: 'tyro.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CheckoutTyroComponent implements OnInit {
  @Input() method: PaymentMethod;
  @Input() posStepState: PosStepState;
  
  constructor(protected posStepActions: PosStepActions,
              protected tyroActions: TyroActions) { }
  
  ngOnInit() {
  }
  
  getTyroTransactionData(): Payment3rd {
    return this.posStepState.listPayment3rdData.find((p) => p['type'] === 'tyro');
  }
  
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
  
  hasQuestion() {
    if (this.getTyroTransactionData()) {
      return _.size(this.getTyroTransactionData().additionData['questions']) > 0;
    } else {
      return false;
    }
  }
  
  isSuccess() {
    return this.getTyroTransactionData() && this.getTyroTransactionData().isPaySuccess === true;
  }
  
  getMessage() {
    if (this.getTyroTransactionData() && !!this.getTyroTransactionData().additionData) {
      return this.getTyroTransactionData().additionData['message'];
    } else {
      return null;
    }
  }
}
