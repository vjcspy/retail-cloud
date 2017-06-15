import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {IntegrateRpState, RewardPointType} from "../../../../../../R/integrate/rp/integrate-rp.state";
import {PosQuoteState} from "../../../../../../R/quote/quote.state";
import {IntegrateRpActions} from "../../../../../../R/integrate/rp/integrate-rp.actions";
import {PosStepState} from "../../../../../R/sales/checkout/step/step.state";
import {PosConfigState} from "../../../../../../R/config/config.state";
import {PosSyncState} from "../../../../../../R/sync/sync.state";

@Component({
             //moduleId: module.id,
             selector: 'checkout-rewardpoint',
             templateUrl: 'rewardpoint.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CheckoutRewardPointComponent {
  @Input() posQuoteState: PosQuoteState;
  @Input() posStepState: PosStepState;
  @Input() posConfigState: PosConfigState;
  @Input() posSyncState: PosSyncState;
  
  constructor(public integrateRpActions: IntegrateRpActions) {}
  
  isAheadWorldRp() {
    return this.posConfigState.posRetailConfig.rpType === 'aheadWorld';
  }
  
  isUsingPoint() {
    const rpData = this.posQuoteState.quote.getRewardPointData();
    return (!!rpData && rpData['use_reward_point'] === true);
  }
  
  getRewardPointDetail() {
    const rpData = this.posQuoteState.quote.getRewardPointData();
    return !!rpData ? rpData : {};
  }
  
}