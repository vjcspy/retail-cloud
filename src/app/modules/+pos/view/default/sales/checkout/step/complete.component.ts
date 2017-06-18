import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Payment3rd, PosStepState} from "../../../../R/sales/checkout/step/step.state";
import {ReceiptActions} from "../../../../R/sales/receipts/receipt.actions";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosStepActions} from "../../../../R/sales/checkout/step/step.actions";
import {PosGeneralState} from "../../../../../R/general/general.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-step-complete',
             templateUrl: 'complete.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutStepCompleteComponent implements OnInit {
  @Input() posStepState: PosStepState;
  @Input() posQuoteState: PosQuoteState;
  @Input() posGeneralState: PosGeneralState;
  
  openEmailSender: boolean = false;
  customerEmail: string    = '';
  
  constructor(public posStepActions: PosStepActions, public receiptActions: ReceiptActions) { }
  
  ngOnInit() {
    if (!this.posQuoteState.quote.getUseDefaultCustomer()) {
      this.customerEmail = this.posQuoteState.quote.getCustomer().getData('email');
    }
    
    if (parseInt(this.posGeneralState.register['is_print_receipt']) === 1) {
      this.printReceipt();
    }
  }
  
  printReceipt(typePrint: string = 'receipt') {
    let customerReceipt: any = null, merchantReceipt: any = null;
    if (this.posStepState.listPayment3rdData.count() > 0) {
      const payment3rd: Payment3rd = this.posStepState.listPayment3rdData.first();
      customerReceipt              = payment3rd.customerReceipt;
      merchantReceipt              = payment3rd.merchantReceipt;
    }
    this.receiptActions.printSalesReceipt(this.posStepState.orderOffline, typePrint, customerReceipt, merchantReceipt);
  }
}
