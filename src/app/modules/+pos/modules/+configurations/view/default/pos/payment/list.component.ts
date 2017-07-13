import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";
import {FormValidationService} from "../../../../../../../share/provider/form-validation";
import {ConfigurationsPaymentService} from "../../../../R/payment/payment.service";
import {ConfigurationsPaymentActions} from "../../../../R/payment/payment.actions";
import {ConfigurationsState} from "../../../../R/index";
import {PaymentDB} from "../../../../../../database/xretail/db/payment";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-payment-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosPaymentListComponent implements OnInit {
  @Input() entitiesState: PosEntitiesState;
  @Input() configurationsState: ConfigurationsState;
  
  constructor(private formValidation: FormValidationService,
              private configurationsPaymentService: ConfigurationsPaymentService,
              private configurationsPaymentActions: ConfigurationsPaymentActions) {
  }
  
  getPayments() {
    return this.configurationsPaymentService.paymentSnapshot;
  }
  
  save() {
    this.formValidation.submit('payment_edit_data', async () => {
      this.configurationsPaymentActions.savePayment(this.getPayments());
    }, true);
  }
  
  getPaymentTypeSelect() {
    return {
      data: [
        {label: "Credit card", value: "credit_card"}
      ]
    };
  }
  
  ngOnInit() { }
  
  addNewPayment() {
    let payment     = new PaymentDB();
    payment['type'] = 'credit_card';
    
    this.configurationsPaymentService.paymentSnapshot = this.configurationsPaymentService.paymentSnapshot.push(payment);
  }
}
