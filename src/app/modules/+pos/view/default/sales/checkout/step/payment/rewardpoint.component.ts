import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {IntegrateRpState, RewardPointType} from "../../../../../../R/integrate/rp/integrate-rp.state";
import {PosQuoteState} from "../../../../../../R/quote/quote.state";
import * as _ from 'lodash';
import {IntegrateRpActions} from "../../../../../../R/integrate/rp/integrate-rp.actions";
import {PosStepState} from "../../../../../R/sales/checkout/step/step.state";

@Component({
             //moduleId: module.id,
             selector: 'checkout-rewardpoint',
             templateUrl: 'rewardpoint.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CheckoutRewardPointComponent {
  @Input() integrateRpState: IntegrateRpState;
  @Input() posQuoteState: PosQuoteState;
  @Input() posStepState: PosStepState;
  
  protected data = {
    useRp: false
  };
  
  constructor(public integrateRpActions: IntegrateRpActions) {}
  
  isAheadWorldRp() {
    return this.integrateRpState.rpType === RewardPointType.AheadWorld;
  }
  
  
  getRewardPointDetail() {
    return _.isObject(this.posQuoteState.quote.getData("reward_point")) ? this.posQuoteState.quote.getData("reward_point") : {};
  }
  
}
