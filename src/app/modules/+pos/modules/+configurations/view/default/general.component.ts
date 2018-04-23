import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AppHelper} from "../../../../../../services/app-helper";
import * as Cookies from "js-cookie";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-general',
             templateUrl: 'general.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultGeneralComponent implements OnInit {
    public posVersion;
    public apiVersion;
    public compatible;
  constructor( private appHelper: AppHelper) {
      this.posVersion = appHelper.getPosVersion();
      this.apiVersion = Cookies.get('api_version');
  }
  
  ngOnInit() {
      this.compatible = this.appHelper.checkApiVersionCompatible();
  }
}
