import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosStepState} from "../../../../R/sales/checkout/step/step.state";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosStepActions} from "../../../../R/sales/checkout/step/step.actions";
import {OfflineService} from "../../../../../../share/provider/offline";
import {IntegrateRpState} from "../../../../../R/integrate/rp/integrate-rp.state";
import {PosConfigState} from "../../../../../R/config/config.state";
import {PosSyncState} from "../../../../../R/sync/sync.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-step-payments',
             templateUrl: 'payment.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutStepPaymentsComponent implements OnInit {
  @Input() posStepState: PosStepState;
  @Input() posQuoteState: PosQuoteState;
  @Input() posConfigState: PosConfigState;
  @Input() posSyncState: PosSyncState;
  
  constructor(public posStepActions: PosStepActions, public offlineService: OfflineService) { }
  
  ngOnInit() { }
  
  showRewardPointPayment() {
    return this.posConfigState.posRetailConfig.isIntegrateRP && this.posQuoteState.items.count() > 0 && !this.posQuoteState.quote.getUseDefaultCustomer();
  }
  
  trackById(index, method) {
    return method['id'];
  }
  
  checkActionOrder() {
    return this.posStepState.totals.remain < 0.01 || this.posQuoteState.info.isRefunding;
  }
  
  disableClickSaveOrder(): boolean {
    return this.posStepState.isChecking3rd || this.posStepState.isSavingOrder
           || (!this.posConfigState.posRetailConfig.allowPartialPayment && this.posStepState.totals.remain >= 0.01 && !this.posQuoteState.info.isRefunding)
           || (this.posQuoteState.info.isRefunding && Math.abs(this.posStepState.totals.remain) > 0.01);
  }
  
  getRewardPointDetail() {
    const rpData = this.posQuoteState.quote.getRewardPointData();
    return !!rpData ? rpData : {};
  }
}
