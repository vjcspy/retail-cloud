import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {RetailConfigState} from "../../../../R/retail-config/retail-config.state";
import {RetailConfigService} from "../../../../R/retail-config/retail-config.service";

@Component({
             // moduleId: module.id,
             selector: 'configurations-d-efault-pos-checkout-setting',
             templateUrl: 'setting.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDEfaultPosCheckoutSettingComponent implements OnInit {
  @Input() retailConfigState: RetailConfigState;
  
  constructor(protected retailConfigService: RetailConfigService) {
  }
  
  getRetailConfigSnapshot() {
    return this.retailConfigService.retailConfigSnapshot;
  }
  
  ngOnInit() { }
}
