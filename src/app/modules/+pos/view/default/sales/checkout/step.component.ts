import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {CheckoutStep, PosStepState} from "../../../R/sales/checkout/step/step.state";
import {Router} from "@angular/router";
import {IntegrateRpState} from "../../../../R/integrate/rp/integrate-rp.state";
import {PosConfigState} from "../../../../R/config/config.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-step',
             templateUrl: 'step.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutStepComponent implements OnInit {
  @Input() posQuoteState: PosQuoteState;
  @Input() posStepState: PosStepState;
  @Input() integrateRpState: IntegrateRpState;
  @Input() posConfigState: PosConfigState;
  
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
