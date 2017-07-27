import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {RetailTranslate} from "../../../../../../services/retail-translate";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-translate',
             templateUrl: 'translate.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultTranslateComponent implements OnInit {
  public currentLanguage;
  
  constructor(protected retailTranslate: RetailTranslate) { }
  
  ngOnInit(): void {
    if (this.retailTranslate.getCurrentLanguage()) {
      this.currentLanguage = this.retailTranslate.getCurrentLanguage();
    }
  }
  
  public getLanguagesElemData() {
    return this.retailTranslate.getListLanguageSupport();
  }
  
  updateLanguage(event) {
    console.log(event);
    this.retailTranslate.updateLanguage(event);
  }
}
