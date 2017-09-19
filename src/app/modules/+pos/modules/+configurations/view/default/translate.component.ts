import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {RetailTranslate} from "../../../../../share/provider/retail-translate";
import {NotifyManager} from "../../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-translate',
             templateUrl: 'translate.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultTranslateComponent implements OnInit {
  public currentLanguage;
  
  constructor(protected retailTranslate: RetailTranslate, protected notify: NotifyManager) { }
  
  ngOnInit(): void {
    if (this.retailTranslate.getCurrentLanguage()) {
      this.currentLanguage = this.retailTranslate.getCurrentLanguage();
    }
  }
  
  public getLanguagesElemData() {
    return this.retailTranslate.getListLanguageSupport();
  }
  
  updateLanguage(event) {
    if (event !== this.retailTranslate.getCurrentLanguage()) {
      this.retailTranslate.updateLanguage(event);
      this.notify.info("language_will_update_after_refresh_page");
    }
  }
}
