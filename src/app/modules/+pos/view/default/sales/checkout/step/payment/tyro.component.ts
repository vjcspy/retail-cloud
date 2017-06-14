import {Component, OnInit, Input} from '@angular/core';
import * as _ from "lodash";
import {PosStepActions} from "../../../../../R/sales/checkout/step/step.actions";
import {Payment3rd, PaymentMethod, PosStepState} from "../../../../../R/sales/checkout/step/step.state";
import {TyroActions} from "../../../../../R/sales/checkout/step/payment/tyro.actions";

@Component({
             //moduleId: module.id,
             selector: 'checkout-payment-tyro',
             templateUrl: 'tyro.component.html',
           })
export class CheckoutTyroComponent implements OnInit {
  @Input() method: PaymentMethod;
  @Input() posStepState: PosStepState;
  
  constructor(protected posStepActions: PosStepActions,
              protected tyroActions: TyroActions) { }
  
  ngOnInit() {
    this.posStepActions.add3rdPayment({
                                        type: 'tyro',
                                        isPaySuccess: false,
                                        inUse: true,
                                        additionData: Object.assign({
                                                                      message: '',
                                                                      questions: []
                                                                    }, this.method.payment_data)
                                      });
  }
  
  getTyroTransactionData(): Payment3rd {
    return this.posStepState.listPayment3rdData.find((p) => p['type'] === 'tyro');
  }
  
  changeAmount(value) {
    value += '';
    if (isNaN(value) || !value) {
      value = 0;
    }
    if (value.indexOf(".") === (value.length - 1) || value.indexOf(",") === (value.length - 1)) {
      return;
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
