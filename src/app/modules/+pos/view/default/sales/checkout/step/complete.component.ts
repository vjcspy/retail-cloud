import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosStepState} from "../../../../R/sales/checkout/step/step.state";
import {ReceiptActions} from "../../../../R/sales/receipts/receipt.actions";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosStepActions} from "../../../../R/sales/checkout/step/step.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-step-complete',
             templateUrl: 'complete.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutStepCompleteComponent implements OnInit {
  @Input() posStepState: PosStepState;
  @Input() posQuoteState: PosQuoteState;
  
  openEmailSender: boolean = false;
  customerEmail: string    = '';
  
  constructor(public posStepActions: PosStepActions, public receiptActions: ReceiptActions) { }
  
  ngOnInit() {
    if (!this.posQuoteState.quote.getUseDefaultCustomer()) {
      this.customerEmail = this.posQuoteState.quote.getCustomer().getData('email');
    }
  }
  
  printReceipt(typePrint: string = 'receipt') {
    this.receiptActions.printSalesReceipt(this.posStepState.orderOffline, typePrint);
  }
}
