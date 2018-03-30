import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosStepState} from "../../../../R/sales/checkout/step/step.state";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosStepActions} from "../../../../R/sales/checkout/step/step.actions";
import {OfflineService} from "../../../../../../share/provider/offline";
import {IntegrateRpState} from "../../../../../R/integrate/rp/integrate-rp.state";
import {PosConfigState} from "../../../../../R/config/config.state";
import {PosSyncState} from "../../../../../R/sync/sync.state";
import * as _ from "lodash"
import {NotifyManager} from "../../../../../../../services/notify-manager";

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
  
  constructor(public posStepActions: PosStepActions, public offlineService: OfflineService, protected notify: NotifyManager) { }
  
  ngOnInit() { }
  
  showRewardPointPayment() {
    return this.posConfigState.posRetailConfig.isIntegrateRP && this.posQuoteState.items.count() > 0 && !this.posQuoteState.quote.getUseDefaultCustomer();
  }
  
  showGCPayment() {
    return this.posConfigState.posRetailConfig.isIntegrateGC && this.posQuoteState.items.count() > 0;
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
  
  complete() {
    if (this.isUseTyroAndPaidOver()) {
      this.notify.error("overpay_is_not_allowed_when_tyro_is_chosen");
      return;
    }
    this.posStepActions.userSaveOrder();
  }
  
  protected isUseTyroAndPaidOver() {
    const isUseTyro = this.posStepState.paymentMethodUsed.find((p) => p['type'] === 'tyro');
    return (isUseTyro && this.posStepState.totals.grandTotal < this.posStepState.totals.totalPaid);
  }
  
  getRewardPointDetail() {
    const rpData = this.posQuoteState.quote.getRewardPointData();
    return !!rpData ? rpData : {};
  }
  
  back() {
    this.posQuoteState.quote.setData('reward_point', Object.assign({}, {use_reward_point: false}));
    this.posQuoteState.quote.setData('gift_card', Object.assign({}, {...this.posQuoteState.quote.getGiftCardData()}, {is_delete: true}));
    this.posStepActions.back();
  }
  
  applyGiftCard(){
    return this.posStepActions.userSelectGC();
  }
  
  demo(){
    return {'gift_code': null, 'giftcard_amount': null, 'create_at': null, is_delete: true};
  }
}
