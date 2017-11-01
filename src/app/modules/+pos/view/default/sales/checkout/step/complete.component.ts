import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Payment3rd, PosStepState} from "../../../../R/sales/checkout/step/step.state";
import {ReceiptActions} from "../../../../R/sales/receipts/receipt.actions";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosStepActions} from "../../../../R/sales/checkout/step/step.actions";
import {PosGeneralState} from "../../../../../R/general/general.state";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {ReceiptState} from "../../../../R/sales/receipts/receipt.state";
import {AppStorage} from "../../../../../../../services/storage";
// import {UserCollection} from "../../../../../../../services/meteor-collections/users";
import {PosConfigState} from "../../../../../R/config/config.state";
import {OfflineService} from "../../../../../../share/provider/offline";

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
  @Input() configState: PosConfigState;
  
  openEmailSender: boolean = false;
  customerEmail: string    = '';
  public isRefundExchange  = false;
  
  constructor(public posStepActions: PosStepActions, public receiptActions: ReceiptActions, private notify: NotifyManager, protected storage: AppStorage ,private offline: OfflineService) { }
  
  ngOnInit() {
    if (!this.posQuoteState.quote.getUseDefaultCustomer()) {
      this.customerEmail = this.posQuoteState.quote.getCustomer().getData('email');
    }
    
    if (parseInt(this.posGeneralState.register['is_print_receipt']) === 1) {
      this.printReceipt(!!this.posStepState.orderRefund ? 'refund' : 'receipt');
    }
  }
  
  print() {
    if (this.isRefundExchange === true) {
      return this.closeAllAdditionButton();
    }
    
    if (!!this.posStepState.orderRefund) {
      this.isRefundExchange = true;
    } else {
      this.printReceipt();
    }
  }
  
  protected closeAllAdditionButton() {
    this.openEmailSender  = false;
    this.isRefundExchange = false;
  }
  
  printReceipt(typePrint: string = 'receipt') {
    this.closeAllAdditionButton();
    if (typePrint === 'receipt' || typePrint === 'gift') {
      let customerReceipt: any = null;
      let merchantReceipt: any = null;
      if (this.posStepState.listPayment3rdData.count() > 0) {
        const payment3rd: Payment3rd = this.posStepState.listPayment3rdData.first();
        customerReceipt              = payment3rd.customerReceipt;
        merchantReceipt              = payment3rd.merchantReceipt;
      }
      this.receiptActions.printSalesReceipt(this.posStepState.orderOffline, typePrint, customerReceipt, merchantReceipt);
    } else if (typePrint === 'refund') {
      this.receiptActions.printSalesReceipt(this.posStepState.orderRefund, 'receipt');
    }
  }
  
  sendEmailReceipt() {
    if (this.offline.online) {
      const email = this.customerEmail;
      let re      = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(email) === false) {
        return this.notify.warning("email_not_valid");
      }
      let name = this.posQuoteState.quote.getCustomer().getData('first_name') + ' ' + this.posQuoteState.quote.getCustomer().getData('last_name');
      let settingReceipt = {
        receiptSetting: this.configState.receipt,
        // username: this.userCollection.getUserNameById(this.posStepState.orderOffline['user_id']),
        username :  this.storage.localRetrieve('email'),
        inclDiscountPerItemInDiscount: this.configState.posRetailConfig.inclDiscountPerItemInDiscount
      };
      this.receiptActions.sendEmailReceipt(this.posStepState.orderOffline, this.customerEmail, name, settingReceipt);
    } else {
      this.notify.warning("sorry_you_can_not_send_email_in_offline");
    }
  }
}
