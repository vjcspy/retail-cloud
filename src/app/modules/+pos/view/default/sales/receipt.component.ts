import {Component, Input, OnInit} from '@angular/core';
import {PosConfigState} from "../../../R/config/config.state";
import {ReceiptState} from "../../R/sales/receipts/receipt.state";

@Component({
             moduleId: module.id,
             selector: 'pos-default-sales-receipt',
             templateUrl: 'receipt.component.html'
           })
export class PosDefaultSalesReceiptComponent implements OnInit {
  @Input() posConfigState: PosConfigState;
  @Input() receiptState: ReceiptState;
  
  constructor() { }
  
  ngOnInit() { }
  
  getReceiptSetting(): Object {
    return this.posConfigState.receipt;
  }
  
  getOrder(): Object {
    return this.receiptState.salesReceipt.orderOffline;
  }
  
  protected checkoutAsGuest(): boolean {
    if (this.getOrder().hasOwnProperty('customer')) {
      return this.getOrder()['customer']['id'] == this.posConfigState.setting.customer.getDefaultCustomerId();
    } else
      return false;
  }
}
