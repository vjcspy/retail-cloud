import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Payment3rd, PosStepState} from "../../../../R/sales/checkout/step/step.state";
import {ReceiptActions} from "../../../../R/sales/receipts/receipt.actions";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosStepActions} from "../../../../R/sales/checkout/step/step.actions";
import {PosGeneralState} from "../../../../../R/general/general.state";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {ReceiptState} from "../../../../R/sales/receipts/receipt.state";

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
  @Input() receiptState: ReceiptState;
  
  openEmailSender: boolean = false;
  customerEmail: string    = '';
  public isRefundExchange  = false;
  
  constructor(public posStepActions: PosStepActions, public receiptActions: ReceiptActions, private notify: NotifyManager) { }
  
  ngOnInit() {
    if (!this.posQuoteState.quote.getUseDefaultCustomer()) {
      this.customerEmail = this.posQuoteState.quote.getCustomer().getData('email');
    }
    
    if (parseInt(this.posGeneralState.register['is_print_receipt']) === 1) {
      this.printReceipt();
    }
  }
  
  print() {
    if (!!this.posStepState.orderOffline) {
      this.isRefundExchange = true;
    } else {
      this.printReceipt();
    }
  }
  
  printReceipt(typePrint: string = 'receipt') {
    if (typePrint === 'receipt') {
      let customerReceipt: any = null;
      let merchantReceipt: any = null;
      if (this.posStepState.listPayment3rdData.count() > 0) {
        const payment3rd: Payment3rd = this.posStepState.listPayment3rdData.first();
        customerReceipt              = payment3rd.customerReceipt;
        merchantReceipt              = payment3rd.merchantReceipt;
      }
      this.receiptActions.printSalesReceipt(this.posStepState.orderOffline, typePrint, customerReceipt, merchantReceipt);
    } else if (typePrint === 'refund') {
      this.isRefundExchange = false;
      this.receiptActions.printSalesReceipt(this.posStepState.orderRefund, 'receipt');
    }
  }
  
  sendEmailReceipt() {
    const email = this.customerEmail;
    let re      = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email) === false) {
      return this.notify.warning("Email not valid");
    }
    let name = this.posQuoteState.quote.getCustomer().getData('first_name') + ' ' + this.posQuoteState.quote.getCustomer().getData('last_name');
    this.receiptActions.sendEmailReceipt(this.posStepState.orderOffline, this.customerEmail, name);
  }
}
