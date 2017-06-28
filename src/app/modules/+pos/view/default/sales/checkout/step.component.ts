import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {CheckoutStep, PosStepState} from "../../../R/sales/checkout/step/step.state";
import {Router} from "@angular/router";
import {PosConfigState} from "../../../../R/config/config.state";
import {PosSyncState} from "../../../../R/sync/sync.state";
import {PosGeneralState} from "../../../../R/general/general.state";
import {ReceiptState} from "../../../R/sales/receipts/receipt.state";
import {OrderService} from "../../../R/sales/orders/order.service";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-step',
             templateUrl: 'step.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutStepComponent implements OnInit {
  @Input() posQuoteState: PosQuoteState;
  @Input() posStepState: PosStepState;
  @Input() posConfigState: PosConfigState;
  @Input() posSyncState: PosSyncState;
  @Input() posGeneralState: PosGeneralState;
  @Input() receiptState: ReceiptState;
  
  constructor(protected router: Router, protected orderViewService: OrderService) { }
  
  ngOnInit() { }
  
  isOrderListPage() {
    return this.orderViewService.isActiveOrdersPage();
  }
  
  isStepPayment() {
    return this.posStepState.checkoutStep === CheckoutStep.PAYMENT;
  }
  
  isStepComplete() {
    return this.posStepState.checkoutStep === CheckoutStep.COMPLETE;
  }
}
