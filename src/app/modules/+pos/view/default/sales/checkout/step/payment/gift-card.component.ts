import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosQuoteState} from "../../../../../../R/quote/quote.state";
import {PosStepState} from "../../../../../R/sales/checkout/step/step.state";
import {PosConfigState} from "../../../../../../R/config/config.state";
import {PosSyncState} from "../../../../../../R/sync/sync.state";
import {OfflineService} from "../../../../../../../share/provider/offline";
import {IntegrateGCActions} from "../../../../../../R/integrate/gc/gc.actions";

@Component({
             // moduleId: module.id,
             selector: 'gift-card',
             templateUrl: 'gift-card.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class CheckoutGiftCardComponent implements OnInit {
  @Input() posQuoteState: PosQuoteState;
  @Input() posStepState: PosStepState;
  @Input() posConfigState: PosConfigState;
  @Input() posSyncState: PosSyncState;
  @Input() gcData: any;
  
  giftCode: string = "";
  
  constructor(public offline: OfflineService,
              public integrateGCActions: IntegrateGCActions) { }
  
  ngOnInit() {
    // const gcData = this.posQuoteState.quote.getGiftCardData();
    if (!!this.gcData && this.gcData['gift_code']) {
      this.giftCode = this.gcData['gift_code'];
    }
  }
  
  isAheadWorldGC() {
    return this.posConfigState.posRetailConfig.gcType === 'aheadWorld';
  }
  
  isUsingGiftCard() {
    // const gcData = this.posQuoteState.quote.getGiftCardData();
    return !!this.gcData && !isNaN(this.gcData['base_giftcard_amount']) && parseFloat(this.gcData['base_giftcard_amount']) !== 0;
  }
  
  getGiftCardData() {
    // const gcData = this.posQuoteState.quote.getGiftCardData();
    return !!this.gcData ? this.gcData : [];
  }
}
