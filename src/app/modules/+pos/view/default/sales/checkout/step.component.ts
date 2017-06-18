import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {CheckoutStep, PosStepState} from "../../../R/sales/checkout/step/step.state";
import {Router} from "@angular/router";
import {PosConfigState} from "../../../../R/config/config.state";
import {PosSyncState} from "../../../../R/sync/sync.state";
import {PosGeneralState} from "../../../../R/general/general.state";

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
  
  constructor(protected router: Router) { }
  
  ngOnInit() { }
  
  isOrderListPage() {
    return this.router.isActive("order-list", false);
  }
  
  isStepPayment() {
    return this.posStepState.checkoutStep === CheckoutStep.PAYMENT;
  }
  
  isStepComplete() {
    return this.posStepState.checkoutStep === CheckoutStep.COMPLETE;
  }
}
