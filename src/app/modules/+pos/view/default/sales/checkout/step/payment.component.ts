import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosStepState} from "../../../../R/sales/checkout/step/step.state";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosStepActions} from "../../../../R/sales/checkout/step/step.actions";
import {OfflineService} from "../../../../../../share/provider/offline";
import {IntegrateRpState} from "../../../../../R/integrate/rp/integrate-rp.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-step-payments',
             templateUrl: 'payment.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutStepPaymentsComponent implements OnInit {
  @Input() posStepState: PosStepState;
  @Input() posQuoteState: PosQuoteState;
  @Input() integrateRpState: IntegrateRpState;
  
  constructor(public posStepActions: PosStepActions, public offlineService: OfflineService) { }
  
  ngOnInit() { }
  
  showRewardPointPayment() {
    return this.integrateRpState.isIntegrate && this.posQuoteState.quote.getData('reward_point') && this.posQuoteState.items.count() > 0 && !this.posQuoteState.quote.getUseDefaultCustomer();
  }
  
  trackById(index, method) {
    return method['id'];
  }
  
  checkActionOrder() {
    return this.posStepState.totals.remain < 0.01 || this.posQuoteState.info.isRefunding;
  }
}
