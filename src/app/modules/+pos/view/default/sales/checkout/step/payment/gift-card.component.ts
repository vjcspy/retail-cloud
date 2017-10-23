import {Component, Input, OnInit} from '@angular/core';
import {PosQuoteState} from "../../../../../../R/quote/quote.state";
import {PosStepState} from "../../../../../R/sales/checkout/step/step.state";
import {PosConfigState} from "../../../../../../R/config/config.state";
import {PosSyncState} from "../../../../../../R/sync/sync.state";
import {OfflineService} from "../../../../../../../share/provider/offline";
import {IntegrateGCActions} from "../../../../../../R/integrate/gc/gc.actions";

@Component({
             // moduleId: module.id,
             selector: 'gift-card',
             templateUrl: 'gift-card.component.html'
           })

export class CheckoutGiftCardComponent implements OnInit {
  @Input() posQuoteState: PosQuoteState;
  @Input() posStepState: PosStepState;
  @Input() posConfigState: PosConfigState;
  @Input() posSyncState: PosSyncState;
  
  giftCode: string = "";
  
  constructor(public offline: OfflineService,
              public integrateGCActions: IntegrateGCActions) { }
  
  ngOnInit() {
    const gcData = this.posQuoteState.quote.getGiftCardData();
    if (!!gcData && gcData['gift_code']) {
      this.giftCode = gcData['gift_code'];
    }
  }
  
  isAheadWorldGC() {
    return this.posConfigState.posRetailConfig.gcType === 'aheadWorld';
  }
  
  isUsingGiftCard() {
    const gcData = this.posQuoteState.quote.getGiftCardData();
    
    return !!gcData && parseFloat(gcData['base_giftcard_amount']) > 0;
  }
  
  getGiftCardData() {
    const rpData = this.posQuoteState.quote.getGiftCardData();
    return !!rpData ? rpData : {};
  }
}
