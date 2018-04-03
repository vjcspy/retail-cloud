import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";
import {FormValidationService} from "../../../../../../../share/provider/form-validation";
import {ConfigurationsPaymentService} from "../../../../R/payment/payment.service";
import {ConfigurationsPaymentActions} from "../../../../R/payment/payment.actions";
import {ConfigurationsState} from "../../../../R/index";
import {PaymentDB} from "../../../../../../database/xretail/db/payment";
import {TyroPayment} from "../../../../../../services/payment-integrate/tyro";
import {DialogService} from "../../../../../../../dialog/dialog.service";
import * as _ from 'lodash';

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-payment-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosPaymentListComponent implements OnInit {
  @Input() entitiesState: PosEntitiesState;
  @Input() configurationsState: ConfigurationsState;
  
  private contentTooltip = 'Round midpoint down (e.g. 1.05 will round to 1.00)' + '\n' +
                           'Round midpoint up (e.g. 1.05 will round to 1.10)' + '\n' +
                           'Always round down (e.g. 1.08 will round to 1.00)' + '\n' +
                           'Always round up (e.g. 1.02 will round to 1.10)';
  
  public dataSelect = {
    tyroGateway: {
      data: [
        {label: "iclientsimulator.test", value: "iclientsimulator"},
        {label: "iclient.test", value: "iclient"},
      ]
    },
    roundTo: {
      data: [
        {label: "0.01 Cash Denomination", value: "0.01_cash_denomination"},
        {label: "0.05 Cash Denomination", value: "0.05_cash_denomination"},
        {label: "0.10 Cash Denomination", value: "0.10_cash_denomination"},
        {label: "0.50 Cash Denomination", value: "0.50_cash_denomination"},
        {label: "1 Cash Denomination", value: "1_cash_denomination"}
      ]
    },
    roundingRule: {
      data: [
        {label: "Round midpoint down", value: "round_midpoint_down"},
        {label: "Round midpoint up", value: "round_midpoint_up"},
        {label: "Always round down", value: "always_round_down"},
        {label: "Always round up", value: "always_round_up"}
      ]
    },
  };
  
  constructor(private formValidation: FormValidationService,
              private configurationsPaymentService: ConfigurationsPaymentService,
              private configurationsPaymentActions: ConfigurationsPaymentActions,
              private dialogService: DialogService,
              private tyroPayment: TyroPayment) {
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
  
  pairTyro(tid, mid) {
    return this.tyroPayment.pair(tid, mid, (response: Object) => {});
  }
  
  requestTerminalInfo(tid, mid) {
    return this.tyroPayment.requestTerminalInfo(tid, mid, (info) => {
      let content = '';
      _.forEach(info, (val, key) => {
        content += `<div><span>${key}: ${val}</span></div>`;
      });
      this.dialogService.info("Terminal Information", content);
    });
  }
  
}
